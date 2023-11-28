<template>
  <!-- fetching data from firebase for admin -->
  <div class="relative z-10">
    <div
      class="space-y-8 flex flex-col justify-center items-left mx-auto bg-gray-100 shadow-md my-3 rounded-lg py-5 max-w-[900px]">
      <div class="rounded-md p-2 flex items-center gap- justify-between">
        <span class="flex text-xl font-semibold">
          <p class="px-2">Ques:</p>
          <div>{{ item.ques }}</div>
        </span>

        <div v-if="isGuestBoard" class="flex justify-center items-center space-x-5">
          <font-awesome-icon icon="fa-solid fa-trash" class="cursor-pointer" @click="deleteCard(item.id)" />
          <font-awesome-icon icon="fa-solid fa-pen-to-square" class="cursor-pointer" @click="isFormOpenToEdit(item)" />
        </div>
      </div>

      <div class="flex space-x-9 px-5 pb-4">
        <div v-if="isGuestBoard">
          <p v-for="it in item.choices" :key="it.id">
            <input type="radio" class="cursor-pointer" :disabled="true" />
            {{ it.option }}
          </p>
        </div>

        <div v-if="!isGuestBoard">
          <form v-on:submit.prevent="submitByGuest">
            <div>
              <p v-for="it in item.choices" :key="it.id" class="space-x-1 flex">
                <input type="radio" name="choices" :value="it.option" :id="it.option" class="cursor-pointer" />
                <label for="choices">{{ it.option }}</label>
              </p>


              <button class="bg-gray-300 p-2 rounded-md mt-3 active:bg-gray-400" type="submit"
                :disabled="isUserClickedSubmit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- <div v-if="isGuestBoard"
      class="space-y-8 flex flex-col justify-center items-left mx-auto bg-gray-100 shadow-md my-3 rounded-lg py-5 max-w-[900px]">
      <div class="rounded-md p-2 flex items-center gap- justify-between">
        <span class="flex text-xl font-semibold">
          <p class="px-2">Ques:</p>
          <div>{{ item.ques }}</div>
        </span>

        <div class="flex justify-center items-center space-x-5">
          <font-awesome-icon icon="fa-solid fa-trash" class="cursor-pointer" @click="deleteCard(item.id)" />
          <font-awesome-icon icon="fa-solid fa-pen-to-square" class="cursor-pointer" @click="isFormOpenToEdit(item)" />
        </div>
      </div>

      <div class="flex space-x-9 px-5 pb-4">
        <div>
          <p v-for="it in item.choices" :key="it.id">
            <input type="radio" class="cursor-pointer" :disabled="true" />
            {{ it.option }}
          </p>
        </div>
      </div>
    </div> -->

    <!-- user -->
    <!-- <div v-else
      class="space-y-8 flex flex-col justify-center items-left mx-auto bg-gray-100 shadow-md my-3 rounded-lg py-5 max-w-[900px]">
      <h3>user</h3>
      <div class="rounded-md p-2 flex items-center gap- justify-between">
        <span class="flex text-xl font-semibold">
          <p class="px-2">Ques:</p>
          <div>{{ item.ques }}</div>
        </span>
      </div>

      <div>
        <form v-on:submit.prevent="submitByGuest">
          <div>
            <p v-for="it in item.choices" :key="it.id" class="space-x-1 flex">
              <input type="radio" name="choices" :value="it.option" class="cursor-pointer" />
              <label for="choices">{{ it.option }}</label>
            </p>
          </div>
        </form>
        <button class="bg-gray-300 p-2 rounded-md mt-3 active:bg-gray-400" type="submit" :disabled="isUserClickedSubmit">
          Submit
        </button>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { signOut, getAuth, onAuthStateChanged } from "@firebase/auth";
import Form from "../components/Form.vue";
import firebaseApp from "../firebaseConfig";
import { collection, doc, getFirestore } from "firebase/firestore";
import { ref } from "vue";
import store from "@/store";

// init service
const db = getFirestore();
const auth = getAuth(firebaseApp);

// collection ref
const colRef = collection(db, "polls");
const colUser = collection(db, "users");

//isUser clicked submit
const isUserClickedSubmit = ref(false);

const polledData = ref(null)

const { item, isGuestBoard } = defineProps(["item", "isGuestBoard"]);
console.log(isGuestBoard, "isGuestBoard");
console.log(item);

const emit = defineEmits(["is-form-open-to-edit"]);

function isFormOpenToEdit(item) {
  // console.log(item);
  emit("is-form-open-to-edit", item);
}

function deleteCard(id) {
  store.dispatch("deleteCard", id);
}

async function submitByGuest() {
  console.log(item.id);
  console.log(item);
  let ele = document.getElementsByName("choices");
  
  let i;
  for (i = 0; i < ele.length; i++) {
    if (ele[i].checked && !ele[i].disabled) {
      console.log(ele[i].value);
      polledData.value = ele[i].value;
      console.log(polledData.value)
      item.choices.map((it)=> document.getElementById(it.option).disabled = true)
      await store.dispatch("addedPoll", { id: item.id, question: item.ques, pollChoice: polledData.value })
    }
  }
  isUserClickedSubmit.value = true;
}
</script>
