import {
  signOut,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "@firebase/auth";
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
  const choicesData = choices.value;

  const colRefPolls = collection(db, "polls");
  addDoc(colRefPolls, {
    ques: questionData,
    choices: choicesData,
  });
}

export function deleteCard({ commit }, idOfCardToBeDeleted) {
  console.log(idOfCardToBeDeleted);
  const docRef = doc(db, "polls", idOfCardToBeDeleted);

  deleteDoc(docRef).then(() => {
    console.log("deletedform");
  });
}

export function addUserData({ commit }, { name, email, password, role }) {
  console.log(name, email, password, role);
  try {
    commit("addUserDataInState", { name, email, password, role });
  } catch (err) {
    console.log(err);
  }
}

export function logoutUser({ commit }) {
  try {
    commit("logoutCurrentUser");
  } catch (err) {
    console.log(err);
  }
}

export function loginInUser({ commit, dispatch }, { email, password }) {
  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      dispatch("addUser", cred.user);
      console.log("login success");
    })
    .catch((err) => {
      console.log(err.message);
    });
}

export function addUser({ commit }, data) {

  const userId = data.uid
   const docRef = doc(db, "users", userId);
   getDoc(docRef).then((doc) => {
     console.log(doc.data());
     commit("addUserDataInState", doc.data());
   });
}
