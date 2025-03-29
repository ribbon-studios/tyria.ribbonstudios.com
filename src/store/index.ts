import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import apiReducer from './api.slice';
import accountReducer from './account.slice';
import appReducer from './app.slice';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    api: apiReducer,
    app: appReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
