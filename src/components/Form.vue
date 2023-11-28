<template>
  <div>
    <!-- admin form to add Data -->
    <div class="bg-gray-300 w-96 rounded-md pb-10">
      <font-awesome-icon
        icon="fa-solid fa-xmark"
        class="text-white text-2xl ml-80 cursor-pointer"
        @click="emit('is-form-open')"
      />

      <h2 class="py-3 text-2xl font-serif">Form to add Polls</h2>
      <form v-on:submit.prevent="submitHandler">
        <div>
          <!-- title bar -->
          <div class="py-4">
            <label for="ques" class="px-2">Ques:</label>
            <input
              placeholder="type here"
              v-model="question"
              class="rounded-md px-2"
            />
          </div>

          <!-- field -->
          <div class="py-4" v-for="item in choices" :key="item.id">
            <label for="field" class="px-2">Choice:</label>
            <input
              placeholder="type here"
              class="rounded-md px-2"
              v-model="item.option"
            />
          </div>
        </div>

        <div class="bg-gray-100 w-40 mx-auto rounded-md">
          <button type="submit">Submit Form</button>
        </div>
      </form>

      <div class="bg-gray-100 w-40 mx-auto rounded-md mt-3">
        <button @click="addDataToList">Add More Options</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import store from "../store";
import { getAuth } from "@firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import firebaseApp from "../firebaseConfig";

// init service
const db = getFirestore();
const auth = getAuth(firebaseApp);

// collection ref
const colRef = collection(db, "polls");
const colUser = collection(db, "users");

const emit = defineEmits(["is-form-open"]);
const question = ref("");

const { currentEditCard, addNewPoll } = defineProps([
  "currentEditCard",
  "addNewPoll",

]);
console.log(addNewPoll);

const choices = ref([
  {
    id: 1,
    option: "",
  },
  {
    id: 2,
    option: "",
  },
]);
if (currentEditCard.id) {
  question.value = currentEditCard.ques;
  choices.value = [];
  currentEditCard?.choices?.map((data) => {
    choices.value.push({
      id: data.id,
      option: data.option,
    });
  });
}

function addDataToList() {
  choices.value.push({
    id: choices.value.length + 1,
    option: "",
  });
}

async function submitHandler() {
  if (addNewPoll == true) {
    console.log(question, choices);
    if (
      !question.value ||
      !choices.value[0].option ||
      !choices.value[1].option
    ) {
      return alert("Fill all fields");
    }
    await store.dispatch("addNewPolls", { question, choices });
    emit("is-form-open");
  } else {
    let optionEmpty = false;
    if (!question.value) {
      return alert("Please fill question");
    }
    choices.value.map((it) => {
      if (it.option == "") {
        optionEmpty = true;
        return alert("Add all choices")
      }
    });

    if (optionEmpty == false) {
      await store.dispatch("updatePolls", {
        option: choices.value,
        ques: question.value,
        id: currentEditCard?.id,
      });
      emit("is-form-open");
    }
  }
}
</script>
