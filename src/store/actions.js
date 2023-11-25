import {
  signOut,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "@firebase/auth";
import {
  collection,
  getFirestore,
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
import { ref } from "vue";

// init service
const db = getFirestore();
const auth = getAuth(firebaseApp);

// collection ref
const colRef = collection(db, "polls");
const colUser = collection(db, "users");

const currerntLoggedInUserId = ref(null);

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
  const userId = data?.uid;
  const docRef = doc(db, "users", userId);
  getDoc(docRef).then((doc) => {
    console.log(doc.data());
    commit("addUserDataInState", doc.data());
  });
}

export function signUpNewUser(
  { commit, dispatch },
  { email, password, name, role }
) {
  console.log(email, password, role, name);

  createUserWithEmailAndPassword(auth, email, password).then((cred) => {
    console.log(cred);
    console.log("signup done");

    dispatch("addUser", cred?.user);

    onAuthStateChanged(auth, (user) => {
      console.log("current loggedin user", user);
      currerntLoggedInUserId.value = user.uid;
    });

    setTimeout(() => {
      console.log(currerntLoggedInUserId.value);
      setDoc(doc(colUser, currerntLoggedInUserId.value), {
        name: name,
        email: email,
        password: password,
        role: role,
      })
        .then(() => {
          console.log("doc is set now with uid");
          console.log(currerntLoggedInUserId.value);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }, 1000);
  });
}
