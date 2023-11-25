<template>
  <div class="bg-violet-200 h-screen">
    <form v-on:submit.prevent="userLogin">
      <p class="text-3xl pt-4 font-serif">Login here</p>
      <div
        class="space-y-10 mt-20 py-7 shadow-2xl bg-gray-200 rounded-xl mx-auto w-[700px] h-60"
      >
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

        <button
          type="submit"
          class="bg-gray-400 font-semibold p-2 rounded-md mr-20"
        >
          Submit
        </button>
      </div>
    </form>
    <div class="mt-11 flex flex-col items-center justify-center">
      <div class="font-semibold">Do not have an account ?</div>
      <router-link to="/signup">
        <div class="bg-gray-200 p-2 mt-3 rounded-md w-32 cursor-pointer">
          Signup here
        </div>
      </router-link>
    </div>
  </div>
</template>

<!-- <script setup> -->
<script setup>
import {
  signOut,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { collection, getFirestore, onSnapshot, doc } from "firebase/firestore";
import firebaseApp from "../firebaseConfig";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import store from "@/store";

const router = useRouter();

// init service
const db = getFirestore();
const auth = getAuth(firebaseApp);

// collection ref
const colRef = collection(db, "polls");
const colUser = collection(db, "users");

const email = ref(null);
const password = ref(null);

async function userLogin() {
  console.log("router")
  await store.dispatch("loginInUser", { email: email.value, password: password.value })
  router.push({name: 'dashboard'})
  }

onMounted(() => {
  setTimeout(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(user)
    })
  }, 1000)
})
</script>
