import type { Schema } from '@ribbon-studios/guild-wars-2';
import {
  Achievement as RawAchievement,
  type AccountAchievement,
  type AchievementCategory,
} from '@ribbon-studios/guild-wars-2/v2';
import { useMemo } from 'react';
import { useAccountAchievements } from './use-account-achievements';

export function useEnhancedAchievements({
  category,
  achievements,
  prerequisite_achievements,
}: {
  category?: AchievementCategory<Schema.LATEST>;
  achievements?: RawAchievement<Schema.LATEST>[];
  prerequisite_achievements?: RawAchievement<Schema.LATEST>[];
}) {
  const { account_achievements, ...query } = useAccountAchievements({
    achievements,
  });

  return {
    ...query,
    enhanced_achievements: useMemo(() => {
      if (!achievements) return [];

      const enhanced_achievements = achievements.map((achievement) =>
        UseEnhancedAchievements.enhance(category, achievement, prerequisite_achievements, account_achievements)
      );

      return UseEnhancedAchievements.sort(enhanced_achievements, ['description', 'locked', 'done', 'meta']);
    }, [category, achievements, prerequisite_achievements, account_achievements]),
  };
}

export function useEnhancedAchievement({
  category,
  achievement,
  prerequisite_achievements,
}: {
  category?: AchievementCategory<Schema.LATEST>;
  achievement?: RawAchievement<Schema.LATEST>;
  prerequisite_achievements?: RawAchievement<Schema.LATEST>[];
}) {
  const { account_achievements, ...query } = useAccountAchievements({
    achievements: achievement ? [achievement] : undefined,
  });

  return {
    ...query,
    enhanced_achievement: useMemo(() => {
      if (!achievement) return null;

      return UseEnhancedAchievements.enhance(category, achievement, prerequisite_achievements, account_achievements);
    }, [category, achievement, prerequisite_achievements, account_achievements]),
  };
}

export namespace UseEnhancedAchievements {
  export type Achievement = Omit<RawAchievement<Schema.LATEST>, 'prerequisites' | 'bits'> & {
    tier: RawAchievement.Tier;
    done: boolean;
    prerequisites?: RawAchievement<Schema.LATEST>[];
    progress?: {
      current: number;
      max: number;
      bits?: Bit[];
    };
    meta?: boolean;
  };

  export type Bit = RawAchievement.Bit & {
    done: boolean;
  };

  export namespace Bit {
    export type Item = RawAchievement.Bit.Item & {
      done: boolean;
    };

    export type Skin = RawAchievement.Bit.Skin & {
      done: boolean;
    };

    export type Minipet = RawAchievement.Bit.Minipet & {
      done: boolean;
    };

    export type Text = RawAchievement.Bit.Text & {
      done: boolean;
    };
  }

  export function enhance(
    category: AchievementCategory<Schema.LATEST> | undefined,
    { tiers, bits, prerequisites = [], requirement, ...achievement }: RawAchievement<Schema.LATEST>,
    prerequisite_achievements: RawAchievement<Schema.LATEST>[] = [],
    account_achievements?: AccountAchievement<Schema.LATEST>[]
  ): Achievement {
    const account_achievement = account_achievements?.find(({ id }) => achievement.id === id);

    const required_achievements: RawAchievement<Schema.LATEST>[] | undefined = prerequisites
      .filter((id) => {
        return (
          !account_achievements ||
          !account_achievements?.find((account_achievement) => account_achievement.id === id)?.done
        );
      })
      .map((id) => prerequisite_achievements!.find((prerequisite_achievement) => prerequisite_achievement.id === id)!);

    const tier = tiers.reduce((output, tier) => ({
      count: tier.count,
      points: output.points + tier.points,
    }));

    let progress: Achievement['progress'] | undefined;
    if (
      account_achievement !== undefined &&
      account_achievement.current !== undefined &&
      account_achievement.max !== undefined
    ) {
      progress = {
        current: account_achievement.current,
        max: account_achievement.max,
        bits: bits?.map((bit, i) => ({
          ...bit,
          done: (account_achievement.done || account_achievement.bits.includes(i)) ?? false,
        })),
      };
    } else if (bits) {
      progress = {
        current: 0,
        max: bits.length,
        bits: bits?.map((bit) => ({
          ...bit,
          done: false,
        })),
      };
    } else if (tier.count > 1) {
      progress = {
        current: 0,
        max: tier.count,
      };
    }

    if (progress?.bits) {
      progress.bits
        // Sort text bits alphabetically
        .sort((a, b) => {
          if (a.type === RawAchievement.Bit.Type.TEXT && b.type === RawAchievement.Bit.Type.TEXT) {
            return a.text.localeCompare(b.text);
          } else if (a.type === RawAchievement.Bit.Type.TEXT) {
            return 1;
          } else if (b.type === RawAchievement.Bit.Type.TEXT) {
            return -1;
          }

          return 0;
        })
        // Sort completed bits to the bottom.
        .sort((a, b) => {
          if (a.done === b.done) return 0;

          if (a.done) {
            return 1;
          }

          return -1;
        });
    }

    return {
      ...achievement,
      icon: achievement.icon ?? category?.icon,
      requirement: requirement.replace(/\s{2}/gi, ` ${tier.count} `),
      tier,
      tiers,
      done: account_achievement?.done ?? false,
      prerequisites: required_achievements.length > 0 ? required_achievements : undefined,
      meta: achievement.flags.includes(RawAchievement.Flags.CATEGORY_DISPLAY),
      progress,
    };
  }

  export type Sort = (a: Achievement, b: Achievement) => number;

  export function sort(achievements: Achievement[], order: (keyof typeof sorts)[]) {
    return order.reduce((items, key) => items.sort(sorts[key]), achievements);
  }

  export const sorts = {
    // Sort Alphabetically by Description
    description: (a, b) => {
      if (a.description === b.description) return 0;

      if (!b.description) return 1;
      if (!a.description) return -1;

      return a.description.localeCompare(b.description);
    },
    // Sort achievements that are locked to the bottom
    locked: (a, b) => {
      if (a.prerequisites === b.prerequisites) return 0;

      if (a.prerequisites) {
        return 1;
      }

      return -1;
    },
    // Sort completed achievements to the bottom
    done: (a, b) => {
      if (a.done === b.done) return 0;

      if (a.done) {
        return 1;
      }

      return -1;
    },
    // Sort meta achievements to the top
    meta: (a, b) => {
      if (a.meta === b.meta) return 0;

      if (a.meta) {
        return -1;
      }

      return 1;
    },
  } satisfies Record<string, Sort>;
}
