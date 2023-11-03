import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll, deleteObject, getDownloadURL } from "firebase/storage";
import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut} from "firebase/auth";
import {
    getFirestore,
    getDocs,
    doc,
    updateDoc,
    setDoc,  
    getDoc,
    query,
    collection,
    where,
    addDoc,
    deleteDoc} from "firebase/firestore";

    
const firebaseConfig = {
  apiKey: "AIzaSyBa_wbTcd3wPMjDU2edZkZHBMdhXFeai4I",
  authDomain: "taugor-teste-storage.firebaseapp.com",
  projectId: "taugor-teste-storage",
  storageBucket: "taugor-teste-storage.appspot.com",
  messagingSenderId: "683589340981",
  appId: "1:683589340981:web:d0db377f8aca2d58cd067c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const listRef = ref(storage, 'files/');


const logInWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const logout = () => {
    signOut(auth);
  };

// Initialize Firebase
export {
    auth,
    db,
    storage,
    listRef,
    where,
    query,
    ref,
    setDoc,
    updateDoc,
    doc,
    getDoc,
    getDocs,
    collection,
    addDoc,
    listAll,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
    deleteObject,
    deleteDoc,
    getDownloadURL
  };


