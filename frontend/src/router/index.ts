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
    ],
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('../views/LoginView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const disableAuthentification = import.meta.env.VITE_DISABLE_AUTHENTIFICATION;
  if (
    // In production, disableAuthentification is not defined
    (disableAuthentification ? disableAuthentification === 'false' : true) &&
    to.name !== 'Login' &&
    !store.state.isAuthenticated
  )
    next({ name: 'Login' });
  else next();
});

export default router;
