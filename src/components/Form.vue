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
import { ref } from "vue";
import store from "../store";

const emit = defineEmits(["is-form-open"]);
const question = ref("");
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

function addDataToList() {
  choices.value.push({
    id: choices.value.length + 1,
    option: "",
  });
}

function submitHandler() {
  store.dispatch("addNewPolls", { question, choices });
}
</script>
