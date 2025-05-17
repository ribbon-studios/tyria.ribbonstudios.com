import type { AchievementCategory, AchievementGroup, Schema } from '@ribbon-studios/guild-wars-2/v2';
import { json } from '@/utils/parsers';
import { atom, batched, computed, onMount, task } from 'nanostores';
import { api } from '@/service/api';
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

const stored_api_data = json<Omit<ApiSlice, 'loading'>>(localStorage.getItem('api'));
/**
 * Update this to force the cache to update.
 */
export const CURRENT_VERSION = 2;

// Cleanup the old key.
if (stored_api_data && 'categoriesByGroup' in stored_api_data) {
  delete stored_api_data.categoriesByGroup;
  localStorage.setItem('api', JSON.stringify(stored_api_data));
}

export const $version = atom<number>(stored_api_data?.version ?? 0);
export const $error = atom<string | undefined>(stored_api_data?.error);
export const $groups = atom<ApiSlice.Group[]>(stored_api_data?.groups ?? []);

export function getGroupByCategoryId(id: number) {
  return computed([$groups], (groups) => {
    return groups.find((group) => group.categories.some((category) => category.id === id));
  });
}

export const $categories = atom<ApiSlice.Category[]>(stored_api_data?.categories ?? []);

export function getCategoryById(id: number) {
  return computed([$categories], (categories) => {
    return categories.find((category) => category.id === id);
  });
}

export function getCategoryByAchievementId(id: number) {
  return computed([$categories], (categories) => {
    return categories.find((category) => category.achievements.some((achievement) => achievement.id === id));
  });
}

export const $lastUpdated = atom<number | undefined>(stored_api_data?.lastUpdated);

export const $loading = atom<boolean>(true);
export const $app_loading = computed([$loading, $groups, $categories], (loading, groups, categories) => {
  return loading && !groups.length && !categories.length;
});

batched([$version, $categories, $groups], (version, categories, groups) => {
  localStorage.setItem(
    'api',
    JSON.stringify({
      version,
      categories,
      groups,
    })
  );
});

export async function resetCache() {
  task(async () => {
    $loading.set(true);

    try {
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
              // Bonus Events > Marshaling ... (only has dailies, not tracked)
              262, 263, 267, 272, 274, 278, 280, 282,
              // Weekly Fractals (not tracked)
              261,
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

      $groups.set(sortedGroups);
      $categories.set(sortedCategories);
    } catch (error: any) {
      console.error(error);
      $error.set('Failed to load achievement groups and categories.');
    } finally {
      $loading.set(false);
    }
  });
}

onMount($loading, () => {
  const lastUpdated = $lastUpdated.get();
  if ($version.get() !== CURRENT_VERSION || !lastUpdated || lastUpdated < Date.now() - 86400000) {
    resetCache();
  } else {
    $loading.set(false);
  }
});
