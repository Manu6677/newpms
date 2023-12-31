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
  arrayUnion,
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

export async function loginInUser({ commit, dispatch }, { email, password }) {
  await signInWithEmailAndPassword(auth, email, password)
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
    commit("addUserDataInState", { data: doc.data(), uid: userId });
  });
}

export function signUpNewUser(
  { commit, dispatch },
  { email, password, name, role }
) {
  console.log(email, password, role, name);

  createUserWithEmailAndPassword(auth, email, password).then((cred) => {
    console.log(cred);
    // console.log("signup done");

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
          // console.log("doc is set now with uid");
          console.log(currerntLoggedInUserId.value);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }, 1000);
  });
}

export async function updatePolls({ commit }, { option, ques, id }) {
  console.log(option);
  console.log(ques);
  console.log(id);
  const docRef = doc(db, "polls", id);
  await updateDoc(docRef, {
    ques,
    choices: option,
  }).then(() => {
    console.log("updated Doc");
  });
}

export async function addedPoll(
  { commit, state },
  { id, question, pollChoice }
) {
  console.log(id, question, pollChoice);

  let uid = state?.userData?.uid; 
  let ref = doc(db, "polls", id);
  await updateDoc(ref, {
    pollData: arrayUnion({ userId: uid, ques: question, pollChoice }),
  });
}
