import axios from 'axios';
import { redirect } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons';

import { styles } from '@/utils/toasts';

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

const jwtKey = localStorage.getItem('jwtKeyTreBay')
  ? String(localStorage.getItem('jwtKeyTreBay'))
  : ' ';

api.defaults.headers.common['Authorization'] = 'Bearer ' + jwtKey;

//temporary fix for login error
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.warn('Error status', error.response?.status);
    if (error.response.status !== 401) {
      showNotification({
        title: 'Có lỗi xảy ra!',
        message:
          typeof error.response?.data === 'string'
            ? error.response?.data
            : error.response?.data?.msg,
        icon: <IconX />,
        styles: (theme) => styles('red', theme),
      });
    } else {
      window.location.pathname = '/login';
    }
    console.log(error.response?.data);
    return Promise.reject(error);
  }
);
