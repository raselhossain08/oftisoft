
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, addDoc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Simple signaling service via Firestore
export const signaling = {
    calls: collection(db, "calls"),
    createCall: async () => await addDoc(collection(db, "calls"), { createdAt: new Date() }),
    listenToCall: (callId: string, cb: (data: any) => void) => onSnapshot(doc(db, "calls", callId), (snap) => cb(snap.data())),
    updateCall: (callId: string, data: any) => updateDoc(doc(db, "calls", callId), data),
    answerCall: (callId: string) => updateDoc(doc(db, "calls", callId), { accepted: true }),
    hangupCall: (callId: string) => deleteDoc(doc(db, "calls", callId)),
};

// WebRTC Configuration
export const rtcConfig = {
    iceServers: [
        {
            urls: [
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
            ],
        },
    ],
    iceCandidatePoolSize: 10,
};
