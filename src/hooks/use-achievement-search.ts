import { useMemo } from 'react';
import type { UseEnhancedAchievements } from './use-enhanced-achievements';
import { formatter } from '@/utils/formatter';

export function useAchievementSearch(achievements: UseEnhancedAchievements.Achievement[], search?: string) {
  return useMemo(() => {
    if (!search) return achievements;

    const criteria = UseAchievementSearch.criteria.parse(search);

    return achievements.filter((achievement) => {
      return UseAchievementSearch.search(achievement, ['name', 'requirement', 'description'], criteria);
    });
  }, [achievements, search]);
}

export namespace UseAchievementSearch {
  export type KeysMatching<T, V> = {
    [K in keyof T]-?: T[K] extends V ? K : never;
  }[keyof T];

  export type ValidKeys<T> = KeysMatching<T, string | number | boolean>;

  export function search(
    achievement: UseEnhancedAchievements.Achievement,
    keys: ValidKeys<UseEnhancedAchievements.Achievement>[],
    options: criteria.Criteria
  ) {
    return (
      (!options.has || options.has.some((has) => has in achievement)) &&
      (!options.stories ||
        options.stories.some((story) =>
          achievement.stories?.some((value) => formatter(value).lower.simplify.value().includes(story))
        )) &&
      (!options.strikes ||
        options.strikes.some((story) =>
          achievement.strikes?.some((value) => formatter(value).lower.simplify.value().includes(story))
        )) &&
      keys.some((key) => {
        const value = formatter(achievement[key] as string | number | boolean).simplify.sanitize.lower.value();

        return value.includes(options.search);
      })
    );
  }

  export namespace criteria {
    export function parse(value: string): Criteria {
      const lower_search = formatter(value).sanitize.lower.value();

      const matches = Array.from(lower_search.matchAll(/(\w+):("[^"]+"|[^\s]+)/g) ?? []);

      const { search, ...other_criteria } = matches.reduce<Criteria>(
        (output, [match, type, value]) => {
          const corrected_type = correct(type);
          const simplified_value = formatter(value).simplify.value();

          switch (corrected_type) {
            case 'stories': {
              output.stories = output.stories ? [...output.stories, simplified_value] : [simplified_value];
              break;
            }
            case 'strikes': {
              output.strikes = output.strikes ? [...output.strikes, simplified_value] : [simplified_value];
              break;
            }
            case 'has': {
              output.has = output.has ? [...output.has, correct(simplified_value)] : [correct(simplified_value)];
              break;
            }
          }

          output.search = output.search.replace(match, '');

          return output;
        },
        {
          search: lower_search,
        }
      );

      return {
        search: formatter(search.split(' ').filter(Boolean).join(' ')).simplify.value(),
        ...other_criteria,
      };
    }

    export function correct(value: string) {
      return CORRECTION_MAP[value] ?? value;
    }

    export const CORRECTION_MAP: Record<string, string> = {
      story: 'stories',
      strike: 'strikes',
    };

    export type Criteria = {
      search: string;
      stories?: string[];
      strikes?: string[];
      has?: string[];
    };
  }
}
