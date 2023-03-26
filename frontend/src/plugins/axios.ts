import axios from 'axios';
import store from '../store';
import router from '../router';

export function configureAxios() {
  axios.defaults.baseURL = '/api';
  axios.interceptors.request.use((config) => {
    config.headers = config.headers || {};
    config.headers['Authorization'] = 'Bearer ' + store.getters.token;
    return config;
  });

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        router.push('/login');
      }
      return Promise.reject(error);
    },
  );
}
