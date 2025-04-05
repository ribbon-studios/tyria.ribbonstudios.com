import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import apiReducer from './api.slice';
import appReducer from './app.slice';
import settingsReducer from './settings.slice';
import masteryReducer from './mastery.slice';

export const store = configureStore({
  reducer: {
    api: apiReducer,
    app: appReducer,
    settings: settingsReducer,
    mastery: masteryReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
