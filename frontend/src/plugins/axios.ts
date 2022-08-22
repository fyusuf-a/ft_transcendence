import axios from 'axios';
import store from '../store';

export function configureAxios() {
  axios.defaults.baseURL = `http://${import.meta.env.VITE_BACKEND_HOST}:${
    import.meta.env.VITE_BACKEND_PORT
  }`;
  axios.interceptors.request.use((config) => {
    config.headers = config.headers || {};
    config.headers['Authorization'] = 'Bearer ' + store.getters.token;
    return config;
  });
}
