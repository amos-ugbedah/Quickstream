import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtHeFKP8yI5M0R-ggTniIKoI73ag599Pc",
  authDomain: "quickstream-vip.firebaseapp.com",
  projectId: "quickstream-vip",
  storageBucket: "quickstream-vip.firebasestorage.app",
  messagingSenderId: "314420247385",
  appId: "1:314420247385:web:c62ed64517b98b8054aa48",
  measurementId: "G-SZL2WCXJ9Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app); // For saving VIP status and trial dates
export const googleProvider = new GoogleAuthProvider();

// Optional: Customizing Google Provider behavior
googleProvider.setCustomParameters({
  prompt: 'select_account' // Forces the account selector to pop up every time
});

export default app;