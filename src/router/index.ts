import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/Settings.vue"),
  },
  {
    path: "/debug",
    name: "Debug",
    component: () => import("../views/Debug.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
