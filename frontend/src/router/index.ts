import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import { AxiosResponse } from 'axios';
import { ResponseUserDto } from 'src/dtos/users';

const routes = [
  {
    path: '/',
    component: () => import('../views/UILayout.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/ProfileView.vue'),
        name: 'home',
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
        path: 'logout',
        component: () => import('../views/LogoutView.vue'),
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
  {
    name: 'Register',
    path: '/register',
    component: () => import('../views/Register.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _, next) => {
  if (to.path === '/login') {
    next();
  } else if (to.path === '/register') {
    try {
      const response: AxiosResponse<ResponseUserDto> = await axios.get(
        '/users/me',
      );
      if (response.data.username) next('/game');
      else next();
    } catch {
      next('/login');
    }
    next();
  } else {
    try {
      const response: AxiosResponse<ResponseUserDto> = await axios.get(
        '/users/me',
      );
      if (!response.data.username) next('/register');
      else next();
    } catch {
      next('/login');
    }
  }
});

export default router;
