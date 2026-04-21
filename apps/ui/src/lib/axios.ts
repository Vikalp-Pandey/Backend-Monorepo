import axios from 'axios';
import {env} from '@repo/env/client';

const baseURL = env.VITE_API_URL;
// const baseURL = "http://localhost:3000/api";
console.log(baseURL);
export const api = axios.create({
  baseURL,
  withCredentials: true,
});
