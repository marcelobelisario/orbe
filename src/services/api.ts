import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.15.8:3333',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
