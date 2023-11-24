<template>
  <div class="bg-gray-50">
    <!-- THIS IS ADMIN DASHBOARD -->
    <div class="" v-if="checkDashboardForUser === 'admin'">
      <h1 class="font-medium text-3xl py-4 font-serif">Admin DashBoard</h1>

      <!-- fetching data from firebase for admin -->
      <div v-if="surveyData.length > 0">
        <div class="space-y-8">
          <div
            v-for="item in surveyData"
            :key="item.id"
            class="w-96 mx-auto rounded-md bg-gray-100 shadow-lg"
          >
            <div class="pb-5 rounded-md p-2 flex justify-around">
              <span class="flex text-xl">
                <p class="px-2">Ques:</p>
                <div>{{ item.ques }}</div>
              </span>

              <!-- del and edit icon in div -->
              <div class="space-x-4 flex">
                <font-awesome-icon
                  icon="fa-solid fa-trash"
                  class="cursor-pointer"
                  @click="deletePollCard(item.id)"
                />
                <font-awesome-icon
                  icon="fa-solid fa-pen-to-square"
                  class="cursor-pointer"
                  @click="()=>{isFormOpen = true}"
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

        <!-- logout and signup btn and add details add btn -->
        <div class="space-x-3">
          <button
            class="bg-gray-300 p-2 my-6 rounded-md text-xl"
            @click="logoutAdmin"
          >
            Logout
          </button>
          <router-link to="/signup">
            <button class="bg-gray-300 p-2 my-6 rounded-md text-xl">
              Signup
            </button>
          </router-link>

          <!-- add details -->
          <div class="">
            <button
              class="bg-gray-300 p-2 rounded-lg"
              @click="addDetails"
              :disabled="isAddDetailsBtnClicked"
            >
              Add Details
            </button>
          </div>
        </div>
        <!-- btn section end -->
      </div>

      <!-- admin form to add Data -->
      <!-- <div :class="isAddDetailsBtnClicked ? 'activate' : 'deactivate'">
        <font-awesome-icon
          icon="fa-solid fa-xmark"
          @click="closeModalOfAdminFormToAddData"
          class="text-white text-3xl ml-[460px] cursor-pointer"
        />

        <h2 class="py-3 text-2xl font-serif">Form to add Polls</h2>
        <form v-on:submit.prevent="submitHandler">
          <div> -->
      <!-- title bar -->
      <!-- <div class="py-4">
              <label for="ques" class="px-2">Ques:</label>
              <input
                placeholder="type here"
                v-model="question"
                class="rounded-md px-2"
              />
            </div> -->

      <!-- field -->
      <!-- <div class="py-4" v-for="item in data" :key="item.id">
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
        </div> -->
      <!-- </div>  -->

      <Form v-if="isFormOpen"></Form>



      <!-- Modal to edit details by Admin -->
      <div :class="isBtnClickedToEditByAdmin ? 'activate' : 'deactivate'">
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
      </div>
    </div>

    <!-- This is userDashboard -->
    <div class="mt-6" v-else>
      <h1 class="text-2xl">This is user dash board</h1>
    </div>
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

const router = useRouter();

// init service
const db = getFirestore();
const auth = getAuth(firebaseApp);

// collection ref
const colRef = collection(db, "polls");
const colUser = collection(db, "users");
const currerntLoggedInUserId = ref(null);

const surveyData = ref([]);
const checkDashboardForUser = ref(null);
const isAddDetailsBtnClicked = ref(false);

const singleDocID = ref(null);
const singleDocToEdit = ref([]);
const isFormOpen = ref(false)

// logout Admin
function logoutAdmin() {
  signOut(auth)
    .then(() => {
      console.log("logout");
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
  setTimeout(() => {
    onAuthStateChanged(auth, (user) => {
      console.log("current loggedin user", user);
      currerntLoggedInUserId.value = user?.uid;

      if (currerntLoggedInUserId.value) {
        const docRef = doc(db, "users", currerntLoggedInUserId.value);
        getDoc(docRef).then((doc) => {
          console.log(doc.data());
          // console.log(doc.data().role)
          checkDashboardForUser.value = doc.data().role;
        });
      }
    });
  }, 1000);
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
