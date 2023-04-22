import axios from 'axios'

const BASE_URL = `https://parallel-ai.herokuapp.com/api`;

export const publicRequest = axios.create({
  baseURL: BASE_URL
});