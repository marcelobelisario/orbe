import { create } from 'axios';

const hostname = typeof window === 'undefined' ? undefined : window.location?.hostname;
const isLocalWeb = hostname === 'localhost' || hostname === '127.0.0.1';
const baseURL = process.env.EXPO_PUBLIC_API_URL?.trim() || (isLocalWeb ? 'http://127.0.0.1:3333' : undefined);

export const api = create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let sessionToken: string | null = null;
let sessionController = new AbortController();

export function setApiSessionToken(token: string | null) {
  if (token === sessionToken) return;
  sessionController.abort();
  sessionController = new AbortController();
  sessionToken = token;

  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

export function getApiSessionSignal(token: string) {
  return token === sessionToken ? sessionController.signal : undefined;
}

api.interceptors.request.use((config) => {
  if (!baseURL) throw new Error('Configure EXPO_PUBLIC_API_URL no arquivo .env do app.');
  return config;
});
