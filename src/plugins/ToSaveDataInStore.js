import { getAuth, onAuthStateChanged } from "@firebase/auth";
import firebaseApp from "../firebaseConfig";
import store from "../store";

// init service
const auth = getAuth(firebaseApp);
export default {
    install() {
        console.log("ran");
        
    onAuthStateChanged(auth, (user) => {
      if (user?.uid) {
        store.dispatch("addUser", user);
      }
    });
  },
};
