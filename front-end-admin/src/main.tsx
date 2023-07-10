import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { store } from '@/redux/store';
import { Provider } from 'react-redux';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <MantineProvider>
      <ModalsProvider>
        <NotificationsProvider position="top-right" zIndex={2077} autoClose={5000}>
          <App />
        </NotificationsProvider>
      </ModalsProvider>
    </MantineProvider>
  </Provider>
);
