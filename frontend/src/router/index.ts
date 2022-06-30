import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import store from "../store";

import auth from "./auth";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    component: () => import("../views/UILayout.vue"),
    children: [
      {
        path: "",
        component: () => import("../views/ProfileView.vue"),
        meta: {
          middleware: auth,
        },
      },
      {
        path: "profile",
        component: () => import("../views/ProfileView.vue"),
      },
      {
        path: "game",
        component: () => import("../views/GameView.vue"),
      },
      {
        path: "chat",
        component: () => import("../views/ChatView.vue"),
      },
      {
        path: "about",
        component: () => import("../views/AboutView.vue"),
      },
    ],
    meta: {
      middleware: auth,
    },
  },
  {
    name: "Login",
    path: "/login",
    component: () => import("../views/LoginView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (
    process.env.VUE_APP_DISABLE_AUTHENTICATION === "false" &&
    to.name !== "Login" &&
    !store.state.isAuthenticated
  )
    next({ name: "Login" });
  else next();
});

export default router;
