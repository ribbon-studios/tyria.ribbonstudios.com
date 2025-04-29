import { useMemo } from 'react';
import type { UseEnhancedAchievements } from './use-enhanced-achievements';
import { formatter } from '@/utils/formatter';

export function useAchievementSearch(achievements: UseEnhancedAchievements.Achievement[], search?: string) {
  return useMemo(() => {
    if (!search) return achievements;

    return achievements.filter((achievement) => {
      return UseAchievementSearch.search(achievement, ['name', 'requirement', 'description'], search);
    });
  }, [achievements, search]);
}

export namespace UseAchievementSearch {
  export type KeysMatching<T, V> = {
    [K in keyof T]-?: T[K] extends V ? K : never;
  }[keyof T];

  export type ValidKeys<T> = KeysMatching<T, string | number | boolean>;

  export function search<T extends object>(item: T, keys: ValidKeys<T>[], search: string) {
    const options = criteria.parse(search);

    return keys.some((key) => {
      const value = formatter(item[key] as string | number | boolean).lower.value();

      return (
        (!options.stories || options.stories.some((story) => value.includes(story))) && value.includes(options.search)
      );
    });
  }

  export namespace criteria {
    export function parse(value: string): Criteria {
      const search = formatter(value).lower.value();

      const matches = Array.from(search.matchAll(/(\w+):"([^"]+)"|(?:([^\s]+))/g) ?? []);

      return matches.reduce<Criteria>(
        (output, [match, type, value]) => {
          switch (type) {
            case 'story': {
              output.stories = output.stories ? [...output.stories, value] : [value];
              break;
            }
          }

          output.search = output.search.replace(match, '');

          return output;
        },
        {
          search,
        }
      );
    }

    export type Criteria = {
      search: string;
      stories?: string[];
    };
  }
}
