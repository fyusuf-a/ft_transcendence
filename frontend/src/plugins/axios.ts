import axios from 'axios';
import store from '../store';
import router from '../router';
import config from '../config';

export function configureAxios() {
  axios.defaults.baseURL = config.backendURL;
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
