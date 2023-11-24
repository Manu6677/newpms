import { signOut, getAuth, onAuthStateChanged } from "@firebase/auth";
import {
  collection,
  getFirestore,
  query,
  where,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  onSnapshot,
  setDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import firebaseApp from "../firebaseConfig";

// init service
const db = getFirestore();
const auth = getAuth(firebaseApp);

// collection ref
const colRef = collection(db, "polls");
const colUser = collection(db, "users");

export function addNewPolls({ commit }, { question, choices }) {
    const questionData = question.value;
    const choicesData = choices.value

  const colRefPolls = collection(db, "polls");
  addDoc(colRefPolls, {
    ques: questionData,
    choices: choicesData,
  });
}
