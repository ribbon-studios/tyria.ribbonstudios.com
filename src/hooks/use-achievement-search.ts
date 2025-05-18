import { useMemo } from 'react';
import type { UseEnhancedAchievements } from './use-enhanced-achievements';
import { formatter } from '@/utils/formatter';
import type { Better } from '@/types';

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
    { not, ...options }: criteria.Criteria | criteria.Criteria.Not
  ): boolean {
    return (
      (!not || !search(achievement, keys, not)) &&
      (!options.has || options.has.some((has) => has in achievement)) &&
      (!options.stories ||
        options.stories.some((story) =>
          achievement.stories?.some((value) => formatter(value).lower.simplify.value().includes(story))
        )) &&
      (!options.strikes ||
        options.strikes.some((story) =>
          achievement.strikes?.some((value) => formatter(value).lower.simplify.value().includes(story))
        )) &&
      (!options.search ||
        keys.some((key) => {
          const value = formatter(achievement[key] as string | number | boolean).simplify.sanitize.lower.value();

          return value.includes(options.search!);
        }))
    );
  }

  export namespace criteria {
    export function parse(value: string): Criteria {
      const lower_search = formatter(value).sanitize.lower.value();

      const matches = Array.from(lower_search.matchAll(/(\w+)(?::(\w+))?:("[^"]+"|[^\s]+)/g) ?? []);

      const { search, ...other_criteria } = matches.reduce<Better.Required<Criteria, 'search'>>(
        (output, [match, type, sub_type, value]) => {
          const corrected_type = correct(type);
          const corrected_sub_type = correct(sub_type);
          const relevant_type = corrected_sub_type ?? corrected_type;
          const simplified_value = formatter(value).simplify.value();

          let criteria: Criteria | Criteria.Not = output;
          if (corrected_type === 'not') {
            output.not = output.not ?? {};
            criteria = output.not;
          }

          switch (relevant_type) {
            case 'stories': {
              criteria.stories = criteria.stories ? [...criteria.stories, simplified_value] : [simplified_value];
              break;
            }
            case 'strikes': {
              criteria.strikes = criteria.strikes ? [...criteria.strikes, simplified_value] : [simplified_value];
              break;
            }
            case 'has': {
              criteria.has = criteria.has ? [...criteria.has, correct(simplified_value)] : [correct(simplified_value)];
              break;
            }
            case 'not': {
              criteria.search = simplified_value;
            }
          }

          output.search = output.search.replace(match, '');

          return output;
        },
        {
          search: lower_search,
        }
      );

      const final_search = formatter(search.split(' ').filter(Boolean).join(' ')).simplify.trim.value();

      return {
        search: final_search || undefined,
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
      search?: string;
      stories?: string[];
      strikes?: string[];
      has?: string[];
      not?: Criteria.Not;
    };

    export namespace Criteria {
      export type Not = Omit<Criteria, 'not'> & {
        not?: never;
      };
    }
  }
}
