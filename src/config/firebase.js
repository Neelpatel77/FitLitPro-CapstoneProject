import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import 'firebase/auth';
import 'firebase/firestore';
 

const firebaseConfig = {
  apiKey: "AIzaSyDc4xIj_02uYTR2ylwg-P7GlMUsF_aJN-I",
  authDomain: "sprint1-fitlitpro.firebaseapp.com",
  projectId: "sprint1-fitlitpro",
  storageBucket: "sprint1-fitlitpro.appspot.com",
  messagingSenderId: "490665347806",
  appId: "1:490665347806:web:fa2875073f40778c38504f",
  measurementId: "G-8ESTKNN0FV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase authentication
export const auth = getAuth(app);
 
// Firebase Firestore
export const firestore = getFirestore(app);

export default app;



