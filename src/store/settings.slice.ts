import { api } from '@/service/api';
import { type AppState } from '.';
import { createAppSlice } from './utils';
import { parseSafe } from '@/utils/json';
import type { PayloadAction } from '@reduxjs/toolkit';

export type SettingsSlice = {
  api: {
    key?: string;
    refresh_interval: number | null;
  };
  toggles: {
    pin_incomplete_meta_achievements: boolean;
    hide_completed_achievements: boolean;
    debug_mode: boolean;
  };
};

const cachedState = parseSafe<SettingsSlice>(localStorage.getItem('account'));

const initialState: SettingsSlice = {
  ...cachedState,
  toggles: {
    pin_incomplete_meta_achievements: true,
    hide_completed_achievements: false,
    debug_mode: false,
    ...cachedState?.toggles,
  },
  api: {
    refresh_interval: 30,
    ...cachedState?.api,
  },
};

api.config.access_token = initialState.api.key;

export const SettingsSlice = createAppSlice({
  name: 'api',
  initialState,
  reducers: () => ({
    setApiKey: (state, action: PayloadAction<string | undefined>) => {
      const updatedState: SettingsSlice = {
        ...state,
        api: {
          ...state.api,
          key: action.payload,
        },
      };

      localStorage.setItem('account', JSON.stringify(updatedState));
      api.config.access_token = updatedState.api.key;

      return updatedState;
    },
    setApiSetting: <K extends Exclude<keyof SettingsSlice['api'], 'key'>>(
      state: SettingsSlice,
      action: PayloadAction<[K, SettingsSlice['api'][K]]>
    ) => {
      const [key, value] = action.payload;
      const updatedState: SettingsSlice = {
        ...state,
        api: {
          ...state.api,
          [key]: value,
        },
      };

      localStorage.setItem('account', JSON.stringify(updatedState));

      return updatedState;
    },
    setToggle: <K extends keyof SettingsSlice['toggles']>(
      state: SettingsSlice,
      action: PayloadAction<[K, SettingsSlice['toggles'][K]]>
    ) => {
      const [key, value] = action.payload;
      const updatedState: SettingsSlice = {
        ...state,
        toggles: {
          ...state.toggles,
          [key]: value,
        },
      };

      localStorage.setItem('account', JSON.stringify(updatedState));

      return updatedState;
    },
  }),
});

// Action creators are generated for each case reducer function
export const { setApiKey, setApiSetting, setToggle } = SettingsSlice.actions;

export const selectSettings = (state: AppState) => state.settings;
export const selectApi = (state: AppState) => state.settings.api;
export const selectToggles = (state: AppState) => state.settings.toggles;
export const selectToggle = (key: keyof SettingsSlice['toggles']) => (state: AppState) => selectToggles(state)[key];

export default SettingsSlice.reducer;
