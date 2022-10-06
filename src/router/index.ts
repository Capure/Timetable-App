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
  {
    path: "/lucky",
    name: "Lucky",
    component: () => import("../views/Lucky.vue"),
  },
  {
    path: "/grades",
    name: "Grades",
    component: () => import("../views/Grades.vue"),
  },
  {
    path: "/exams",
    name: "Exams",
    component: () => import("../views/Exams.vue"),
  },
  {
    path: "/messages",
    name: "Messages",
    component: () => import("../views/Messages.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
