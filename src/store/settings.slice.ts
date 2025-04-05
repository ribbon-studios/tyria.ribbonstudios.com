import { api } from '@/service/api';
import { type AppState } from '.';
import { createAppSlice } from './utils';
import { parseSafe } from '@/utils/json';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TuiSelect } from '@/components/common/TuiSelect';

export enum Background {
  Random = -1,
  Desert = 0,
  Zojja = 1,
  Logan = 2,
  Sylvari = 3,
}

export namespace Background {
  export function random() {
    return BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
  }

  export const LabelValues: TuiSelect.LabelValue<Background>[] = Object.entries(Background)
    .filter(([, value]) => typeof value === 'number')
    .map(([label, background]) => ({
      label,
      value: background as Background,
    }));
}

export const BACKGROUNDS = [
  '/backgrounds/background-1.jpg',
  '/backgrounds/background-2.jpg',
  '/backgrounds/background-3.jpg',
  '/backgrounds/background-4.jpg',
];

export type SettingsSlice = {
  api: {
    key?: string;
    refresh_interval: number | null;
  };
  background: Background;
  toggles: {
    pin_incomplete_meta_achievements: boolean;
    hide_completed_achievements: boolean;
    hide_hidden_achievements: boolean;
    debug_mode: boolean;
  };
};

const cachedState = parseSafe<SettingsSlice>(localStorage.getItem('account'));

const initialState: SettingsSlice = {
  background: Background.Random,
  ...cachedState,
  toggles: {
    pin_incomplete_meta_achievements: true,
    hide_completed_achievements: false,
    hide_hidden_achievements: false,
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
    setBackground: (state: SettingsSlice, action: PayloadAction<SettingsSlice['background']>) => {
      const updatedState: SettingsSlice = {
        ...state,
        background: action.payload,
      };

      localStorage.setItem('account', JSON.stringify(updatedState));

      return updatedState;
    },
  }),
});

// Action creators are generated for each case reducer function
export const { setApiKey, setApiSetting, setToggle, setBackground } = SettingsSlice.actions;

export const selectSettings = (state: AppState) => state.settings;
export const selectApiSettings = (state: AppState) => state.settings.api;
export const selectToggles = (state: AppState) => state.settings.toggles;
export const selectToggle = (key: keyof SettingsSlice['toggles']) => (state: AppState) => selectToggles(state)[key];
export const selectRefreshInterval = (state: AppState) => {
  const settings = selectSettings(state);

  if (settings.api.key && settings.api.refresh_interval) {
    return settings.api.refresh_interval * 1000;
  }

  return undefined;
};
export const selectBackgroundImage = (state: AppState) => {
  const settings = selectSettings(state);

  if (settings.background === Background.Random) {
    return Background.random();
  }

  return BACKGROUNDS[settings.background];
};

export default SettingsSlice.reducer;
