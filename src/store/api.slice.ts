import { api } from '@/service/api';
import { type AppState } from '.';
import { createAppSlice } from './utils';
import type { AchievementCategory, AchievementGroup, Schema } from '@ribbon-studios/guild-wars-2/v2';

export type ApiSlice = {
  loading: boolean;
  error?: string;
  groups: AchievementGroup<Schema.LATEST>[];
  categories: AchievementCategory<Schema.LATEST>[];
  categoriesByGroup: Record<string, AchievementCategory<Schema.LATEST>[]>;
};

export const appSlice = createAppSlice({
  name: 'app',
  initialState: {
    loading: true,
    groups: [],
    categories: [],
    categoriesByGroup: {},
  } satisfies ApiSlice as ApiSlice,
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
        fulfilled: (state, { payload: [groups, categories, categoriesByGroup] }) => ({
          ...state,
          groups,
          categories,
          categoriesByGroup,
          loading: false,
        }),
      }
    ),
  }),
});

// Action creators are generated for each case reducer function
export const { fetchAchievementSections } = appSlice.actions;

export const selectApiState = (state: AppState) => state.api;

export const selectGroups = (state: AppState) => selectApiState(state).groups;
export const selectGroup = (id: string) => (state: AppState) =>
  selectApiState(state).groups?.find((group) => group.id === id);

export const selectCategories = (state: AppState) => selectApiState(state).categories;
export const selectCategory = (id: number) => (state: AppState) =>
  selectApiState(state).categories?.find((category) => category.id === id);

export const selectCategoriesByGroup = (state: AppState) => selectApiState(state).categoriesByGroup;

export const selectCategoryByAchievementId = (id: number) => (state: AppState) => {
  return selectApiState(state).categories?.find((category) => {
    return category.achievements.some((achievement) => achievement.id === id);
  });
};

export default appSlice.reducer;
