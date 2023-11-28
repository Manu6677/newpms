<template>
  <div class="bg-gray-50">
    <!-- THIS IS ADMIN DASHBOARD -->

    <div class="relative z-10" v-if="userDataFromStore.role === 'admin'">
      <div class="h-24 max-w-min=[1300px] flex px-5 justify-end space-x-2 font-serif">
        <button class="bg-gray-300 p-2 my-6 rounded-md text-xl" @click="logoutUser">
          Logout
        </button>
        <button class="bg-gray-300 p-2 my-6 rounded-md text-xl" @click="
          () => {
            isFormOpen = true;
            currentEditCard = [{}];
            addNewPoll = true;
          }
        ">
          Add Details
        </button>
      </div>

      <h1 class="font-medium text-3xl font-serif">Admin DashBoard</h1>

      <!-- fetching data for admin -->
      <div v-if="surveyData.length > 0">
        <div v-for="item in surveyData" :key="item.id">
          <AllCards  :item="item" :isGuestBoard=true @is-form-open-to-edit="onIsFormOpenToEdit($event)" />
        </div>
      </div>
    </div>

    <!-- This is userDashboard -->

    <div class="mt-6" v-else>
      <!-- logout btn -->
      <div class="h-24 max-w-min=[1300px] flex px-5 justify-end space-x-2 font-serif">
        <button class="bg-gray-300 p-2 my-6 rounded-md text-xl" @click="logoutUser">
          Logout
        </button>
      </div>
      <h1 class="text-2xl font-serif">This is user dash board</h1>
      <!-- fetch data for guest -->
      <div v-if="surveyData.length > 0">
        <div v-for="item in surveyData" :key="item.id">
          <AllCards :item="item" :isGuestBoard=false />
        </div>
      </div>
    </div>

    <Form @is-form-open="isFormOpen = false" v-if="isFormOpen" :addNewPoll="addNewPoll" :currentEditCard="currentEditCard"
      class="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-30" />
  </div>
</template>

<script setup>
import firebaseApp from "../firebaseConfig";
import store from "../store";
import { signOut, getAuth, onAuthStateChanged } from "@firebase/auth";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { ref } from "vue";
import { useRouter } from "vue-router";
import Form from "../components/Form.vue";
import { computed } from "vue";
import { useStore } from "vuex";

import AllCards from "../components/AllCards.vue";

const router = useRouter();
const storeData = useStore();
const userDataFromStore = computed(() => storeData.state.userData);
console.log(userDataFromStore.value.role);
// console.log(userDataFromStore.length)

const currentEditCard = ref(null);

// init service
const db = getFirestore();
const auth = getAuth(firebaseApp);

// collection ref
const colRef = collection(db, "polls");
const colUser = collection(db, "users");

const isFormOpen = ref(false);
const surveyData = ref([]);

// new poll add
const addNewPoll = ref(true);

//guest form
const isGuestBoard = ref(true)

function onIsFormOpenToEdit(item) {
  console.log(item);
  currentEditCard.value = item;
  isFormOpen.value = true;
  addNewPoll.value = false;
}

// logout User
function logoutUser() {
  signOut(auth)
    .then(() => {
      console.log("logout");
      store.dispatch("logoutUser");
      router.push({ name: "login" });
    })
    .catch((err) => {
      console.log(err.message);
    });
}

// modal to edit data
const isBtnClickedToEditByAdmin = ref(false);
// edited form data to add more fields
const editOption = ref([{}]);
// form data to add by admin
const question = ref("Add your question here");

const data = ref([
  {
    id: 1,
    option: "",
  },
]);

onSnapshot(colRef, (snapshot) => {
  surveyData.value = [];
  snapshot.docs.forEach((doc) => {
    surveyData.value.push({ ...doc.data(), id: doc.id });
  });

  console.log(surveyData.value, "from snapshot");
});
</script>

<style scoped>
.activate {
  display: block;
  top: 0;
  position: absolute;
  z-index: 10;
  height: 420px;
  width: 500px;
  border-radius: 10px;
  background-color: #d3d3d3;
  margin-left: 520px;
  margin-top: 200px;
}

.deactivate {
  display: none;
}
</style>
