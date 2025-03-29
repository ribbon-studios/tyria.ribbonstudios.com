import { api } from '@/service/api';
import { type AppState } from '.';
import { createAppSlice } from './utils';
import type { AccountAchievement, Schema } from '@ribbon-studios/guild-wars-2/v2';
import apiSlice from './api.slice';

export type AccountSlice = {
  refreshInterval: number;
  achievements: {
    data: AccountAchievement<Schema.LATEST>[];
    loading: boolean;
    error?: Error;
  };
};

export const accountSlice = createAppSlice({
  name: 'account',
  initialState: {
    refreshInterval: 30 * 1000,
    achievements: {
      data: [],
      loading: false,
    },
  } satisfies AccountSlice as AccountSlice,
  reducers: (create) => ({
    getAchievements: create.asyncThunk(
      async () => {
        return await api.v2.account.achievements();
      },
      {
        pending: (state) => ({
          ...state,
          achievements: {
            ...state.achievements,
            loading: true,
          },
        }),
        rejected: (state) => ({
          ...state,
          achievements: {
            ...state.achievements,
            loading: false,
          },
        }),
        fulfilled: (state, action) => ({
          ...state,
          achievements: {
            data: action.payload,
            loading: false,
          },
        }),
      }
    ),
  }),
});

// Action creators are generated for each case reducer function
export const { getAchievements } = accountSlice.actions;

export const selectAccountState = (state: AppState) => state.account;
export const selectAchievements = (state: AppState) => selectAccountState(state).achievements;
export const selectRefreshInterval = (state: AppState) => selectAccountState(state).refreshInterval;

export default accountSlice.reducer;
