<template>
  <!-- fetching data from firebase for admin -->
  <div class="relative z-10">
   
    <div class="space-y-8 flex flex-col justify-center items-left mx-auto bg-gray-100 shadow-md my-3 rounded-lg py-5 max-w-[900px]">
      <div
        class="rounded-md p-2 flex items-center gap-4"
      >
        <span class="flex text-xl font-semibold">
          <p class="px-2">Ques:</p>
          <div>{{ item.ques }}</div>
        </span>

        <div class="space-x-4 flex justify-end items-end">
          <font-awesome-icon icon="fa-solid fa-trash" class="cursor-pointer" @click="deleteCard(item.id)"/>
          <font-awesome-icon
            icon="fa-solid fa-pen-to-square"
            class="cursor-pointer"
            @click="emit('is-form-open')"
          />
        </div>
      </div>
      <div class="flex space-x-9 px-5 pb-4">
        <p v-for="it in item.choices" :key="it.id">
          {{ it.option }}
          <input type="radio" disabled="true" />
        </p>
      </div>
    </div>
  </div>

</template>

<script setup>
import { signOut, getAuth, onAuthStateChanged } from "@firebase/auth";
import Form from "../components/Form.vue";
import firebaseApp from "../firebaseConfig";
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
import { ref } from "vue";
import store from "@/store";

// init service
const db = getFirestore();
const auth = getAuth(firebaseApp);

// collection ref
const colRef = collection(db, "polls");
const colUser = collection(db, "users");

const { item } = defineProps(["item"]);

const emit = defineEmits(['is-form-open']);

function deleteCard(id) {
    store.dispatch("deleteCard", id)
}
</script>
