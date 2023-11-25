<template>
  <div class="bg-gray-50">
    <!-- THIS IS ADMIN DASHBOARD -->


    <div class="h-24 max-w-min=[1300px] flex px-5 justify-end space-x-2 font-serif">
      <button class="bg-gray-300 p-2 my-6 rounded-md text-xl" @click="logoutUser">Logout</button>
      <button class="bg-gray-300 p-2 my-6 rounded-md text-xl" @click="()=>{isFormOpen = true}">Add Details</button>
    </div>
     
    <div class="relative z-10" v-if="userDataFromStore.role === 'admin'">
      <h1 class="font-medium text-3xl font-serif">Admin DashBoard</h1>

      <!-- fetching data -->
      <div v-if="surveyData.length > 0">
        <div v-for="item in surveyData" :key="item.id">
          <AllCards :item="item" @is-form-open="isFormOpen = true" />
        </div>
      </div>

          <!-- Modal to edit details by Admin -->
      <!-- <div :class="isBtnClickedToEditByAdmin ? 'activate' : 'deactivate'">
        <font-awesome-icon
          icon="fa-solid fa-xmark"
          @click="closeModalOfAdminToEditData"
          class="text-white text-3xl ml-[460px] cursor-pointer"
        />
        <h2 class="py-3 text-xl">Form to edit details</h2>

        <form v-on:submit.prevent="handleEditedForm">
          <div v-for="item in singleDocToEdit" :key="item.singleDocId">
            <p>Title: {{ item?.singleDocData?.ques }}</p>
            <input
              type="text"
              v-model="item.singleDocData.ques"
              class="space-y-3"
            />

            <div class="space-y-3 mb-3">
              <h1>Choices:</h1>
              <p v-for="it in item.singleDocData.choices">
                <input type="text" v-model="it.option" />
              </p>
            </div>
          </div>

          <div class="bg-gray-100 w-40 mx-auto rounded-md">
            <button type="submit">Submit Form</button>
          </div>
        </form>

        <div class="bg-gray-100 w-40 mx-auto rounded-md my-3">
          <button @click="addMoreFieldsInEdit">Add Choice</button>
        </div>
      </div> -->
    </div>

    <!-- This is userDashboard -->
    <div class="mt-6" v-else>
      <h1 class="text-2xl">This is user dash board</h1>
    </div>

    <Form @is-form-open="isFormOpen = false" v-if="isFormOpen" class="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-30"/>
  </div>
</template>

<script setup>
import firebaseApp from "../firebaseConfig";
import store from "../store";
import { signOut, getAuth, onAuthStateChanged } from "@firebase/auth";
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Form from "../components/Form.vue";
import { computed } from "vue";
import { useStore } from "vuex";

import AllCards from "../components/AllCards.vue";

const router = useRouter();
const storeData = useStore()
const userDataFromStore = computed(() => storeData.state.userData);
console.log(userDataFromStore.value.role)
// console.log(userDataFromStore.length)


// init service
const db = getFirestore();
const auth = getAuth(firebaseApp);

// collection ref
const colRef = collection(db, "polls");
const colUser = collection(db, "users");
const currerntLoggedInUserId = ref(null);

const checkDashboardForUser = ref(null);
const isAddDetailsBtnClicked = ref(false);

const singleDocID = ref(null);
const singleDocToEdit = ref([]);
const isFormOpen = ref(false);
const surveyData = ref([]);



// logout User
function logoutUser() {
    signOut(auth)
    .then(() => {
      console.log("logout");
      store.dispatch("logoutUser")
      router.push({ name: "login" });

    })
    .catch((err) => {
      console.log(err.message);
    });
}

// modal to edit data
const isBtnClickedToEditByAdmin = ref(false);

function closeModalOfAdminToEditData() {
  isBtnClickedToEditByAdmin.value = false;
}

function openModalByAdminToEdit(id) {
  singleDocToEdit.value = [];
  singleDocID.value = id;
  let docRef = doc(db, "polls", id);
  getDoc(docRef).then((doc) => {
    singleDocToEdit.value.push({
      singleDocData: doc.data(),
      singleDocID: doc.id,
    });
  });
  isBtnClickedToEditByAdmin.value = true;
}

function handleEditedForm() {
  console.log("submited changes");
  let docRef = doc(db, "polls", singleDocID.value);
  updateDoc(docRef);
  isBtnClickedToEditByAdmin.value = false;
}


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

function addDataToList() {
  console.log(data);
  data.value.push({
    id: data.value.length + 1,
    option: "",
  });
}

function addMoreFieldsInEdit() {
  console.log("edit fields");
  editOption.value.push({
    id: editOption.value.length + 1,
    option: "",
  });
}

async function submitHandler() {
  console.log("submit handler");
  addDoc(colRef, {
    ques: question.value,
    choices: data.value,
  });
  isAddDetailsBtnClicked.value = false;
}

// delete and edit poll card
function deletePollCard(id) {
  console.log(id);
  const docRef = doc(db, "polls", id);
  deleteDoc(docRef).then(() => {
    console.log("item deleted");
  });
}

// modal open and close
function addDetails() {
  isAddDetailsBtnClicked.value = true;
}
function closeModalOfAdminFormToAddData() {
  isAddDetailsBtnClicked.value = false;
}

onSnapshot(colRef, (snapshot) => {
  surveyData.value = [];
  snapshot.docs.forEach((doc) => {
    surveyData.value.push({ ...doc.data(), id: doc.id });
  });

  console.log(surveyData.value, "from snapshot");
});

onMounted(() => {
  // setTimeout(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     console.log("current loggedin user", user);
  //     currerntLoggedInUserId.value = user?.uid;

  //     if (currerntLoggedInUserId.value) {
  //       const docRef = doc(db, "users", currerntLoggedInUserId.value);
  //       getDoc(docRef).then((doc) => {
  //         console.log(doc.data());
  //         store.dispatch("addUserData", doc.data())
  //         // console.log(doc.data().role)
  //         checkDashboardForUser.value = doc.data().role;
  //       });
  //     }
  //   });
  // }, 1000);
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
