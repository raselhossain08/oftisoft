
import { useState, useRef, useEffect, useCallback } from "react";
import {
    collection, addDoc, onSnapshot, getDoc,
    doc, updateDoc, setDoc, query, where,
    DocumentReference, deleteDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { adminUserAPI } from "@/lib/api";

const rtcConfig = {
    iceServers: [
        { urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"] },
    ],
    iceCandidatePoolSize: 10,
};

export function useCalling() {
    const { user } = useAuth();
    const [activeCall, setActiveCall] = useState<any>(null);
    const [incomingCall, setIncomingCall] = useState<any>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    const pcRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null); // To stop tracks later
    const unsubscribeCallRef = useRef<(() => void) | null>(null);

    // Helper to cleanup media
    const cleanupMedia = () => {
        localStreamRef.current?.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
        setRemoteStream(null);
        if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
        }
    };

    const startCall = async (recipientId: string, type: 'audio' | 'video') => {
        if (!user) return;

        // 1. Create PeerConnection
        const pc = new RTCPeerConnection(rtcConfig);
        pcRef.current = pc;

        // 2. Get Local Media
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: type === 'video',
                audio: true,
            });
            setLocalStream(stream);
            localStreamRef.current = stream;

            stream.getTracks().forEach((track) => {
                pc.addTrack(track, stream);
            });
        } catch (err) {
            console.error("Error accessing media devices:", err);
            toast.error("Could not access camera/microphone");
            return;
        }

        // 3. Create Call Document
        const callDocRef = doc(collection(db, "calls"));
        const offerCandidates = collection(callDocRef, "offerCandidates");
        const answerCandidates = collection(callDocRef, "answerCandidates");

        // 4. Handle ICE Candidates
        pc.onicecandidate = (event) => {
            event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
        };

        // 5. Create Offer
        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);

        const callData = {
            id: callDocRef.id,
            offer: { type: offerDescription.type, sdp: offerDescription.sdp },
            callerId: user.id,
            callerName: user.name, // Sending name directly to avoid fetching
            recipientId: recipientId,
            type: type,
            status: 'offering',
            createdAt: new Date().toISOString(),
        };

        await setDoc(callDocRef, callData);
        setActiveCall(callData);

        // 6. Listen for Remote Answer & Candidates
        pc.ontrack = (event) => {
            event.streams[0] && setRemoteStream(event.streams[0]);
        };

        unsubscribeCallRef.current = onSnapshot(callDocRef, (snapshot) => {
            const data = snapshot.data();
            if (!pc.currentRemoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(data.answer);
                pc.setRemoteDescription(answerDescription);
            }
            // If callee hangs up
            if (data?.status === 'ended') {
                endCall();
                toast.info("Call ended");
            }
        });

        onSnapshot(answerCandidates, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    pc.addIceCandidate(candidate);
                }
            });
        });
    };

    // Answer Call
    const answerCall = async () => {
        if (!incomingCall || !user) return;
        const callId = incomingCall.id;
        const callDocRef = doc(db, "calls", callId);
        const answerCandidates = collection(callDocRef, "answerCandidates");
        const offerCandidates = collection(callDocRef, "offerCandidates");

        const pc = new RTCPeerConnection(rtcConfig);
        pcRef.current = pc;

        // Get Local Media
        const stream = await navigator.mediaDevices.getUserMedia({
            video: incomingCall.type === 'video',
            audio: true,
        });
        setLocalStream(stream);
        localStreamRef.current = stream;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        // Handle ICE
        pc.onicecandidate = (event) => {
            event.candidate && addDoc(answerCandidates, event.candidate.toJSON());
        };

        // Handle Remote Stream
        pc.ontrack = (event) => {
            event.streams[0] && setRemoteStream(event.streams[0]);
        };

        // Set Remote Description (Offer)
        const callSnapshot = await getDoc(callDocRef);
        const callData = callSnapshot.data();
        if (!callData) return;

        await pc.setRemoteDescription(new RTCSessionDescription(callData.offer));

        // Create Answer
        const answerDescription = await pc.createAnswer();
        await pc.setLocalDescription(answerDescription);

        const answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
        };

        await updateDoc(callDocRef, { answer, status: 'connected' });
        setActiveCall({ ...incomingCall, status: 'connected' });
        setIncomingCall(null);

        // Listen for ICE Candidates from Caller
        onSnapshot(offerCandidates, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    pc.addIceCandidate(candidate);
                }
            });
        });

        // Watch for hangup
        unsubscribeCallRef.current = onSnapshot(callDocRef, (snapshot) => {
            if (snapshot.data()?.status === 'ended') {
                endCall();
                toast.info("Call ended");
            }
        });
    };

    const endCall = async () => {
        if (activeCall?.id) {
            // Notify other peer
            try {
                await updateDoc(doc(db, "calls", activeCall.id), { status: 'ended' });
            } catch (e) { console.error(e); }
        }

        cleanupMedia();
        setActiveCall(null);
        setIncomingCall(null);
        if (unsubscribeCallRef.current) unsubscribeCallRef.current();
    };

    const rejectCall = async () => {
        if (incomingCall?.id) {
            await updateDoc(doc(db, "calls", incomingCall.id), { status: 'rejected' });
            setIncomingCall(null);
        }
    };

    // Listen for Incoming Calls
    useEffect(() => {
        if (!user?.id) return;

        const q = query(
            collection(db, "calls"),
            where("recipientId", "==", user.id),
            where("status", "==", "offering") // 'offering' is the initial status
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const data = change.doc.data();
                    // We can fetch caller info here if needed, or use data.callerName if we saved it
                    setIncomingCall({ id: change.doc.id, ...data });
                }
                if (change.type === "removed") {
                    setIncomingCall(null);
                }
            });
        });

        return () => unsubscribe();
    }, [user]);

    return {
        activeCall,
        incomingCall,
        localStream,
        remoteStream,
        startCall,
        answerCall,
        endCall,
        rejectCall
    };
}
