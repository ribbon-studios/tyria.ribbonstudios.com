import { api } from '@/service/api';
import { type AppState } from '.';
import { createAppSlice } from './utils';
import type { AchievementCategory, AchievementGroup, Schema } from '@ribbon-studios/guild-wars-2/v2';
import { parseSafe } from '@/utils/json';
import type { PayloadAction } from '@reduxjs/toolkit';

export type ApiSlice = {
  loading: boolean;
  error?: string;
  groups: AchievementGroup<Schema.LATEST>[];
  categories: AchievementCategory<Schema.LATEST>[];
  categoriesByGroup: Record<string, AchievementCategory<Schema.LATEST>[]>;
  lastUpdated?: number;
};

const initialState: ApiSlice = {
  groups: [],
  categories: [],
  categoriesByGroup: {},
  ...parseSafe<Omit<ApiSlice, 'loading'>>(localStorage.getItem('api')),
  loading: true,
};

export const appSlice = createAppSlice({
  name: 'app',
  initialState,
  reducers: (create) => ({
    fetchAchievementSections: create.asyncThunk(
      async () => {
        const [groups, categories] = await Promise.all([
          api.v2.achievements.groups.list({ ids: 'all' }),
          api.v2.achievements.categories.list({ ids: 'all' }),
        ]);

        const sortedGroups = groups.sort((a, b) => a.order - b.order);
        const sortedCategories = categories.sort((a, b) => a.order - b.order);

        const categoriesByGroup = sortedGroups.reduce<ApiSlice['categoriesByGroup']>((output, group) => {
          output[group.id] = sortedCategories.filter((category) => group.categories.includes(category.id));

          return output;
        }, {});

        return [sortedGroups, sortedCategories, categoriesByGroup] as const;
      },
      {
        pending: (state) => ({
          ...state,
          loading: true,
        }),
        rejected: (state) => ({
          ...state,
          loading: false,
          error: 'Failed to load achievement groups and categories.',
        }),
        fulfilled: (state, { payload: [groups, categories, categoriesByGroup] }) => {
          const updatedState: ApiSlice = {
            ...state,
            groups,
            categories,
            categoriesByGroup,
            loading: false,
            lastUpdated: Date.now(),
          };

          localStorage.setItem('api', JSON.stringify(updatedState));

          return updatedState;
        },
      }
    ),
    setApiLoading: create.reducer((state, action: PayloadAction<boolean>) => ({
      ...state,
      loading: action.payload,
    })),
  }),
});

// Action creators are generated for each case reducer function
export const { fetchAchievementSections, setApiLoading } = appSlice.actions;

export const selectApiState = (state: AppState) => state.api;

export const selectGroups = (state: AppState) => selectApiState(state).groups;
export const selectGroup = (id: string) => (state: AppState) =>
  selectApiState(state).groups?.find((group) => group.id === id);

export const selectCategories = (state: AppState) => selectApiState(state).categories;
export const selectCategory = (id: number) => (state: AppState) => {
  if (isNaN(id)) return undefined;

  return selectApiState(state).categories?.find((category) => category.id === id);
};

export const selectCategoriesByGroup = (state: AppState) => selectApiState(state).categoriesByGroup;

export const selectCategoryByAchievementId = (id: number) => (state: AppState) => {
  if (isNaN(id)) return undefined;

  return selectApiState(state).categories?.find((category) => {
    return category.achievements.some((achievement) => achievement.id === id);
  });
};

export default appSlice.reducer;
