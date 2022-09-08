import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

const routes = [
  {
    path: '/',
    component: () => import('../views/UILayout.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/ProfileView.vue'),
      },
      {
        path: 'profile',
        component: () => import('../views/ProfileView.vue'),
      },
      {
        path: 'game',
        component: () => import('../views/GameView.vue'),
      },
      {
        path: 'chat',
        component: () => import('../views/ChatView.vue'),
      },
      {
        path: 'about',
        component: () => import('../views/AboutView.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('../views/NotFound.vue'),
      },
    ],
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    name: 'Create account',
    path: '/create-account',
    component: () => import('../views/CreateAccountView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const disableAuthentification = import.meta.env.VITE_DISABLE_AUTHENTIFICATION;

router.beforeEach((to, _, next) => {
  if (
    to.name === 'Login' ||
    to.name === 'Login callback' ||
    to.name === 'Create account' ||
    disableAuthentification
  ) {
    next();
  } else if (store.getters.userIsAuthenticated) {
    if (!store.getters.userIsCreated) next({ name: 'Create account' });
    else next();
  } else {
    next({ name: 'Login' });
  }
});

export default router;
