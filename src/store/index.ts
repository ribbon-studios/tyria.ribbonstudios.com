import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import appReducer from './app.slice';
import settingsReducer from './settings.slice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    settings: settingsReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
