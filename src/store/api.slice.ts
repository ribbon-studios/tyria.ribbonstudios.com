import { api } from '@/service/api';
import { type AppState } from '.';
import { createAppSlice } from './utils';
import type { AchievementCategory, AchievementGroup, Schema } from '@ribbon-studios/guild-wars-2/v2';
import { json } from '@/utils/parsers';
import type { PayloadAction } from '@reduxjs/toolkit';
import { formatter } from '@/utils/formatter';

export type ApiSlice = {
  version: number;
  loading: boolean;
  error?: string;
  groups: ApiSlice.Group[];
  categories: ApiSlice.Category[];
  lastUpdated?: number;
};

export namespace ApiSlice {
  export type Group = Omit<AchievementGroup<Schema.LATEST>, 'categories'> & {
    categories: Category[];
  };

  export type Category = AchievementCategory<Schema.LATEST> & {
    /**
     * Version of the name with special variants of characters removed.
     */
    name_sanitized: string;
  };
}

/**
 * Update this to force the cache to update.
 */
export const CURRENT_VERSION = 2;

const initialState: ApiSlice = {
  version: 0,
  groups: [],
  categories: [],
  ...json<Omit<ApiSlice, 'loading'>>(localStorage.getItem('api')),
  loading: true,
};

// Cleanup the old key.
if ('categoriesByGroup' in initialState) {
  delete initialState.categoriesByGroup;
  localStorage.setItem('api', JSON.stringify(initialState));
}

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

        const sortedCategories: ApiSlice.Category[] = categories
          .filter(
            (category) =>
              category.achievements.length > 0 &&
              ![
                // Daily Fooling (not tracked)
                448,
              ].includes(category.id)
          )
          .sort((a, b) => a.order - b.order)
          .map((category) => ({
            ...category,
            name_sanitized: formatter(category.name).sanitize.lower.value(),
          }));

        const sortedGroups: ApiSlice.Group[] = groups
          .map((group) => ({
            ...group,
            categories: sortedCategories.filter((category) => group.categories.includes(category.id)),
          }))
          .filter(
            ({ id, categories }) =>
              categories.length > 0 &&
              ![
                // Daily Group (not tracked)
                '18DB115A-8637-4290-A636-821362A3C4A8',
                // Character Adventure Guide (not tracked)
                'EFADEE67-588F-412F-A1BD-6C9AFF782988',
              ].includes(id)
          )
          .sort((a, b) => a.order - b.order);

        return [sortedGroups, sortedCategories] as const;
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
        fulfilled: (state, { payload: [groups, categories] }) => {
          const updatedState: ApiSlice = {
            ...state,
            version: CURRENT_VERSION,
            groups,
            categories,
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
export const selectApiLoading = (state: AppState) => selectApiState(state).loading;

export const selectGroups = (state: AppState) => selectApiState(state).groups;
export const selectGroup = (id: string) => (state: AppState) =>
  selectApiState(state).groups?.find((group) => group.id === id);

export const selectGroupByCategoryId = (id: number) => (state: AppState) => {
  if (isNaN(id)) return undefined;

  return selectApiState(state).groups.find((group) => group.categories.some((category) => category.id === id));
};

export const selectCategories = (state: AppState) => selectApiState(state).categories;
export const selectCategory = (id: number) => (state: AppState) => {
  if (isNaN(id)) return undefined;

  return selectApiState(state).categories?.find((category) => category.id === id);
};

export const selectCategoryByAchievementId = (id: number) => (state: AppState) => {
  if (isNaN(id)) return undefined;

  return selectApiState(state).categories?.find((category) => {
    return category.achievements.some((achievement) => achievement.id === id);
  });
};

export default appSlice.reducer;
