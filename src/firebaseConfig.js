import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAEW5qTlEsHsLFMLEr-H7_8vdQoqdsHLgo",
  authDomain: "newpms-adfe4.firebaseapp.com",
  projectId: "newpms-adfe4",
  storageBucket: "newpms-adfe4.appspot.com",
  messagingSenderId: "507195515373",
  appId: "1:507195515373:web:dc25b080e25aba395247e4",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// const database = getDatabase(firebaseApp);

export {auth, firebaseApp}
