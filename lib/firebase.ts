
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, addDoc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD897IFAChUyFHMFjqJRPJ6wS06jD30rBo",
  authDomain: "oftisoft-296de.firebaseapp.com",
  projectId: "oftisoft-296de",
  storageBucket: "oftisoft-296de.firebasestorage.app",
  messagingSenderId: "90188203025",
  appId: "1:90188203025:web:a092bed3c085a61e511db0",
  measurementId: "G-FJLNL06KEN"
};

export const app = initializeApp(firebaseConfig);
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
