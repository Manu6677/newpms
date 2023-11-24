<template>
  <div>
    <h1>This is form component</h1>
    <!-- admin form to add Data -->
    <div :class="isAddDetailsBtnClicked ? 'activate' : 'deactivate'">
      <font-awesome-icon
        icon="fa-solid fa-xmark"
        @click="closeModalOfAdminFormToAddData"
        class="text-white text-3xl ml-[460px] cursor-pointer"
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
          <div class="py-4" v-for="item in data" :key="item.id">
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

<script>
// import { ref } from "ref";
</script>
