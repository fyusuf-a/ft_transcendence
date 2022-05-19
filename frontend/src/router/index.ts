import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

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

const isAuthenticated = true;

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next();
});

export default router;
