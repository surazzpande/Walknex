// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup 
} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCN_RfCiq7peuP1BgbTjB7YZi_qCzSVlAQ",
  authDomain: "walknex-2aae7.firebaseapp.com",
  projectId: "walknex-2aae7",
  storageBucket: "walknex-2aae7.firebasestorage.app",
  messagingSenderId: "54634194670",
  appId: "1:54634194670:web:fa372b2384e573724335ff",
  measurementId: "G-C20J9VLM2S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Auth functions
export const createUser = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async () => {
  return signInWithPopup(auth, googleProvider);
};

export const logout = async () => {
  return signOut(auth);
};

export const updateUserProfile = async (user, profile) => {
  return updateProfile(user, profile);
};

export { auth, onAuthStateChanged };