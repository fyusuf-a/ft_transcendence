import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';

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
        props: true,
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
        path: 'leaderboard',
        component: () => import('../views/Leaderboard.vue'),
      },
      {
        path: 'profile/:user',
        component: () => import('../components/Profile/OtherUsersProfile.vue'),
        props: true,
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('../views/NotFound.vue'),
        name: '404',
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

router.beforeEach(async (to, _, next) => {
  if (
    to.name === 'Login' ||
    to.name === 'Login callback' ||
    to.name === 'Create account'
  ) {
    next();
  } else {
    try {
      await axios.get('/users/me');
      next();
    } catch {
      next({ name: 'Login' });
    }
  }
});

export default router;
