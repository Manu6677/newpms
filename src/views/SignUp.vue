<template>
  <div class="bg-violet-200 h-screen">
    <form v-on:submit.prevent="userSignUp">
      <p class="text-3xl pt-4 font-serif">Sign Up Here</p>
      <div
        class="space-y-10 mt-20 py-7 shadow-2xl bg-gray-200 rounded-xl mx-auto w-[700px] h-96"
      >
        <!-- name -->
        <div class="f">
          <label for="name" class="font-semibold pr-7">Name: </label>
          <input
            type="text"
            placeholder="type name"
            v-model="name"
            class="px-2"
          />
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="font-semibold pr-7">Email: </label>
          <input
            type="email"
            placeholder="type email"
            v-model="email"
            class="px-2"
          />
        </div>

        <!-- password -->
        <div>
          <label for="password" class="font-semibold">Password: </label>
          <input
            type="password"
            placeholder="type password"
            v-model="password"
            class="px-2"
          />
        </div>

        <div>
          <label for="role" class="font-semibold pr-7">Role: </label>
          <input
            type="text"
            placeholder="type role"
            v-model="role"
            class="px-2"
          />
        </div>

        <button
          type="submit"
          class="bg-gray-400 font-semibold p-2 rounded-md mr-20"
        >
          Submit
        </button>
      </div>
    </form>

    <div class="mt-11 flex flex-col items-center justify-center">
      <div class="font-semibold">Already have an account?</div>
      <router-link to="/login">
        <div class="bg-gray-200 p-2 mt-3 rounded-md w-32 cursor-pointer">
          Login here
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import firebaseApp from "../firebaseConfig";
import { useRouter } from "vue-router";
import {
  getDocs,
  collection,
  getFirestore,
  addDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";

const name = ref(null);
const email = ref(null);
const password = ref(null);
const role = ref(null);
const currerntLoggedInUserId = ref(null);

const router = useRouter();

// init service
const db = getFirestore();
const auth = getAuth();

// collection ref
const colRef = collection(db, "users");

function userSignUp() {
  if (
    name.value == null ||
    email.value == null ||
    password.value == null ||
    role.value == null
  ) {
    return alert("Fill all fields");
  } else {
    console.log(name.value, email.value, password.value, role.value);
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then((cred) => {
        console.log(cred);
        console.log("signup done");

        onAuthStateChanged(auth, (user) => {
          console.log("current loggedin user", user);
          currerntLoggedInUserId.value = user.uid;
        });

        setTimeout(() => {
          console.log(currerntLoggedInUserId.value);
          
          setDoc(doc(colRef, currerntLoggedInUserId.value), {
            name: name.value,
            email: email.value,
            password: password.value,
            role: role.value,
          }).then(() => {
            console.log("doc is set now with uid");
          });
          router.push({ name: "dashboard" });
        }, 1000);
      })
      .catch((err) => {
        console.log(err.message);
      });

    // addDoc(colRef, {
    //   name: name.value,
    //   email: email.value,
    //   password: password.value,
    //   role: role.value,
    // }).then(() => {
    //     console.log("add signup data in user doc")
    // })
  }
}
</script>
