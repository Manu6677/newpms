import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../views/Login.vue";
import SignUp from "../views/SignUp.vue";
import DashBoard from "../views/DashBoard.vue";
import { useStore } from "vuex";
import store from "@/store";
// const store = useStore();
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUp,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashBoard,
  },
];

console.log;

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  setTimeout(() => {
    console.log(store?.state);
    if (to.path == "/dashboard" && !store?.state?.userData?.data?.role) {
      next("/login");
      console.log(to.path);
    } else if (
      store?.state?.userData?.data?.role &&
      (to.path == "/login" || to.path == "/signup")
    ) {
      next("/dashboard");
      console.log(to.path);
    } else {
      next();
    }
  }, 4000);
});

export default router;
