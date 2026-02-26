import { useAuthStore } from '@/store';
import Toast from 'react-native-toast-message';
import axios from 'axios'
import { useRouter } from 'expo-router';
const backendHost = process.env.EXPO_PUBLIC_API_URL;

const router = useRouter();

export const api = axios.create({ baseURL: backendHost });
export const apiPrivate = axios.create({
  baseURL: backendHost,
  withCredentials: true,
});

apiPrivate.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const refreshToken = useAuthStore.getState().refreshToken;

    const prevRequest = error?.config;
    if (error?.response?.status === 401) {
      const logout = useAuthStore.getState().logout;
      logout();
      Toast.show({
        type: 'success',
        text1: 'Unathorized access! Login.',
      });
    }

    if (error?.response?.status === 403 && !prevRequest?.sent) {
      prevRequest.sent = true;
      const res = await api.post(`/auth/refresh`, { refreshToken });
      const newToken = res.data.data.token;
      useAuthStore.setState({ token: newToken });
      prevRequest.headers['Authorization'] = `Bearer ${newToken}`;
      return api(prevRequest);
    }

    return Promise.reject(error);
  },
);

// unprotected route interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401 && error.config.url != '/auth/login') {
      const logout = useAuthStore.getState().logout;
      logout();
      setTimeout(() => (router.push('/login')), 3000);
      Toast.show({
        type: 'success',
        text1: 'Unathorized access! Login.',
      });
    }

    return Promise.reject(error);
  },
);

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);
