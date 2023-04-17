import axios from 'axios'

const BASE_URL = `https://parallel-2uej.vercel.app/api`;

export const publicRequest = axios.create({
  baseURL: BASE_URL
});