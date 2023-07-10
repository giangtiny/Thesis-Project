import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { createWrapper } from 'next-redux-wrapper';

import { rootReducer } from '@redux/reducers';
import { useDispatch } from 'react-redux';

const logger = createLogger({
  collapsed: true
});

const configStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false
      }).concat(logger),
    devTools: process.env.NODE_ENV !== 'production'
  });

let store: ReturnType<typeof configStore>;

const makeStore = () => {
  store = configStore();
  return store;
};

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export { store };

export const wrapper = createWrapper<AppStore>(makeStore);
