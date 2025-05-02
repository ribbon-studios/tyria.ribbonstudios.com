import type { Schema } from '@ribbon-studios/guild-wars-2';
import {
  Achievement as RawAchievement,
  type AccountAchievement,
  type AchievementCategory,
} from '@ribbon-studios/guild-wars-2/v2';
import { useMemo } from 'react';
import { useAccountAchievements } from './use-account-achievements';

export function useEnhancedAchievements(
  {
    category,
    achievements,
    prerequisite_achievements,
  }: {
    category?: AchievementCategory<Schema.LATEST>;
    achievements?: RawAchievement<Schema.LATEST>[];
    prerequisite_achievements?: RawAchievement<Schema.LATEST>[];
  },
  sorts: UseEnhancedAchievements.SortKey[] = ['name', 'progress', 'locked', 'done', 'meta']
) {
  const { account_achievements, ...query } = useAccountAchievements({
    achievements,
  });

  return {
    ...query,
    enhanced_achievements: useMemo(() => {
      if (!achievements) return [];

      const enhanced_achievements = achievements
        .map((achievement) =>
          UseEnhancedAchievements.enhance(category, achievement, prerequisite_achievements, account_achievements)
        )
        .filter(
          (achievement) =>
            !UseEnhancedAchievements.UNOBTAINABLE_ACHIEVEMENTS.includes(achievement.id) || achievement.done
        );

      return UseEnhancedAchievements.sort(enhanced_achievements, sorts);
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
  export const UNOBTAINABLE_ACHIEVEMENTS: Achievement['id'][] = [
    // Super Adventure Secret
    871,
    // Special Instruction
    872,
  ];

  export type Achievement = Omit<RawAchievement<Schema.LATEST>, 'prerequisites' | 'bits'> & {
    tier: RawAchievement.Tier;
    done: boolean;
    prerequisites?: RawAchievement<Schema.LATEST>[];
    progress?: {
      current: number;
      max: number;
      bits?: Bit[];
    };
    stories?: string[];
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
      ...process.description(achievement),
      icon: achievement.icon ?? category?.icon,
      requirement: process.requirement(requirement, tier, progress),
      tier,
      tiers,
      done: account_achievement?.done ?? false,
      prerequisites: required_achievements.length > 0 ? required_achievements : undefined,
      meta: achievement.flags.includes(RawAchievement.Flags.CATEGORY_DISPLAY),
      progress,
    };
  }

  export namespace process {
    export function requirement(value: string, tier: RawAchievement.Tier, progress?: Achievement['progress']): string {
      let output = value.replace(/\s{2}/gi, ` ${tier.count} `);

      if (progress) {
        output = output.replace(/\s\/\s/gi, ` ${progress.current}/${tier.count} `);
      }

      return output;
    }

    export function description(
      achievement: Pick<RawAchievement<Schema.LATEST>, 'id' | 'description'>
    ): Partial<Achievement> | undefined {
      const [, ...matches] = achievement.description?.match(/([^:]+:)([^<\n]+)/) ?? [];
      const [type, name] = matches.map((match) => match.trim());

      switch (type) {
        case 'Story Instance:':
        case 'Journal:': {
          return { stories: [name.replace(/ Completed$/, '')] };
        }
        default: {
          const [, overrides] = description_fallbacks.find(([ids]) => ids.includes(achievement.id)) ?? [];

          return overrides;
        }
      }
    }

    const description_fallbacks: [number[], Partial<Achievement>][] = [
      [
        [5178, 5191, 5205, 5223, 5228, 5217, 5230, 5202, 5182, 5222, 5200, 5227, 5225, 5189, 5197, 5212, 5214],
        {
          stories: ['Forging Steel'],
        },
      ],
      [
        [5192, 5209, 5181],
        {
          stories: ['Darkrime Delves'],
        },
      ],
      [
        [5234, 5236],
        {
          stories: ['Forging Steel', 'Darkrime Delves'],
        },
      ],
      [
        [5243],
        {
          stories: ['Turnabout'],
        },
      ],
      [
        [5508],
        {
          stories: ['Primordus Rising'],
        },
      ],
      [
        [5517, 5534, 5709, 5511],
        {
          stories: ['Dragon Response Mission: Metrica Province'],
        },
      ],
      [
        [5498, 5490, 5698, 5475],
        {
          stories: ['Dragon Response Mission: Brisban Wildlands'],
        },
      ],
      [
        [5485, 5642, 5688, 5622],
        {
          stories: ['Dragon Response Mission: Bloodtide Coast'],
        },
      ],
      [
        [5478, 5650, 5691, 5644],
        {
          stories: ['Dragon Response Mission: Caledon Forest'],
        },
      ],
      [
        [5536, 5581, 5693, 5580, 5589],
        {
          stories: ['Dragon Response Mission: Fields of Ruin'],
        },
      ],
      [
        [5515, 5640, 5658, 5704, 5663],
        {
          stories: ['Dragon Response Mission: Fireheart Rise'],
        },
      ],
      [
        [5533, 5510, 5486, 5700, 5496],
        {
          stories: ['Dragon Response Mission: Gendarran Fields'],
        },
      ],
      [
        [5504, 5590, 5596, 5697, 5555],
        {
          stories: ['Dragon Response Mission: Lake Doric'],
        },
      ],
      [
        [5502, 5578, 5708, 5593],
        {
          stories: ['Dragon Response Mission: Snowden Drifts'],
        },
      ],
      [
        [5540, 5579, 5703, 5569],
        {
          stories: ['Dragon Response Mission: Thunderhead Peaks'],
        },
      ],
      [
        [5568],
        {
          stories: [
            'Dragon Response Mission: Caledon Forest',
            'Dragon Response Mission: Metrica Province',
            'Dragon Response Mission: Bloodtide Coast',
            'Dragon Response Mission: Fields of Ruin',
            'Dragon Response Mission: Snowden Drifts',
            'Dragon Response Mission: Gendarran Fields',
            'Dragon Response Mission: Lake Doric',
          ],
        },
      ],
    ];
  }

  export type Sort = (a: Achievement, b: Achievement) => number;
  export type SortKey = keyof typeof sorts;

  export function sort(achievements: Achievement[], order: SortKey[]) {
    return order.reduce((items, key) => items.sort(sorts[key]), achievements);
  }

  export const sorts = {
    id: (a, b) => {
      if (a.id > b.id) return 1;
      else return -1;
    },
    // Sort Alphabetically by Name
    name: (a, b) => {
      if (a.name === b.name) return 0;

      if (!b.name) return 1;
      if (!a.name) return -1;

      return a.name.localeCompare(b.name);
    },
    // Sort Alphabetically by Description
    description: (a, b) => {
      if (a.description === b.description) return 0;

      if (!b.description) return 1;
      if (!a.description) return -1;

      return a.description.localeCompare(b.description);
    },
    progress: (a, b) => {
      const progress = {
        a: a.progress ? a.progress.current / a.progress.max : a.done ? 1 : 0,
        b: b.progress ? b.progress.current / b.progress.max : b.done ? 1 : 0,
      };

      if (progress.a < progress.b) return 1;
      if (progress.a > progress.b) return -1;
      return 0;
    },
    // Sort achievements that are locked to the bottom
    locked: (a, b) => {
      const locked = {
        a: !a.done && !a.progress?.current && (!!a.prerequisites || !!a.locked_text),
        b: !b.done && !b.progress?.current && (!!b.prerequisites || !!b.locked_text),
      };

      if (locked.a === locked.b) return 0;

      if (locked.a) {
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
