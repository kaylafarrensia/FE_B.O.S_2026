import axios from 'axios';
import { API_URL } from './config';

export const API = axios.create({
  baseURL: API_URL,
});

API.interceptors.request.use(
  (request) => {
    const token = window.localStorage.getItem('token');

    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  },
  () => Promise.reject()
);