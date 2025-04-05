import { GuildWars2 } from '@ribbon-studios/guild-wars-2';
import {
  Achievement,
  type AccountAchievement,
  type AchievementCategory,
  type Schema,
} from '@ribbon-studios/guild-wars-2/v2';

export const api = new GuildWars2();

export type CategoryAchievement = EnhancedAchievement & {
  category: string;
};

export async function getCategoryAchievements(
  category: AchievementCategory<Schema.LATEST>
): Promise<CategoryAchievement[]> {
  const [achievements = [], accountAchievements = []] = await Promise.all([
    api.v2.achievements.list({
      ids: category.achievements.map(({ id }) => id),
    }),
    api.config.access_token ? api.v2.account.achievements() : [],
  ]);

  const prerequisiteIds = achievements.reduce<number[]>(
    (output, { prerequisites }) => (prerequisites ? output.concat(prerequisites) : output),
    []
  );

  const prerequisiteAchievements =
    prerequisiteIds.length > 0
      ? await api.v2.achievements.list({
          ids: prerequisiteIds,
        })
      : [];

  const categoryAchievements = achievements.map<CategoryAchievement>((achievement) => ({
    ...Helpers.mapAchievement(achievement, accountAchievements, prerequisiteAchievements),
    icon: achievement.icon ?? category.icon,
    category: category.name,
  }));

  return (
    categoryAchievements
      .sort((a, b) => {
        if (a.description === b.description) return 0;

        if (!b.description) return 1;
        if (!a.description) return -1;

        return a.description.localeCompare(b.description);
      })
      // Sort completed achievements to the bottom
      .sort((a, b) => {
        if (a.done === b.done) return 0;

        if (a.done) {
          return 1;
        }

        return -1;
      })
      // Sort achievements that are locked to the bottom
      .sort((a, b) => {
        if (a.prerequisites === b.prerequisites) return 0;

        if (a.prerequisites) {
          return 1;
        }

        return -1;
      })
      // Sort meta achievements to the top
      .sort((a, b) => {
        if (a.meta === b.meta) return 0;

        if (a.meta) {
          return -1;
        }

        return 1;
      })
  );
}

export type EnhancedAchievement = Omit<Achievement<Schema.LATEST>, 'tiers' | 'prerequisites' | 'bits'> & {
  tier: Achievement.Tier;
  done: boolean;
  prerequisites?: Achievement<Schema.LATEST>[];
  progress?: {
    current: number;
    max: number;
    bits?: EnhancedBit[];
  };
  meta?: boolean;
};

export type EnhancedBit = Achievement.Bit & {
  done: boolean;
};

export namespace EnhancedBit {
  export type Item = Achievement.Bit.Item & {
    done: boolean;
  };

  export type Skin = Achievement.Bit.Skin & {
    done: boolean;
  };

  export type Minipet = Achievement.Bit.Minipet & {
    done: boolean;
  };

  export type Text = Achievement.Bit.Text & {
    done: boolean;
  };
}

export async function getAchievement(id: number) {
  const [achievement, accountAchievements] = await Promise.all([
    api.v2.achievements.get(id),
    api.config.access_token ? api.v2.account.achievements() : [],
  ]);

  const prerequisiteAchievements = achievement.prerequisites
    ? await api.v2.achievements.list({
        ids: achievement.prerequisites,
      })
    : [];

  return Helpers.mapAchievement(achievement, accountAchievements, prerequisiteAchievements);
}

export namespace Helpers {
  export function mapAchievement(
    { tiers, bits, prerequisites = [], requirement, ...achievement }: Achievement<Schema.LATEST>,
    accountAchievements: AccountAchievement<Schema.LATEST>[],
    prerequisiteAchievements: Achievement<Schema.LATEST>[]
  ): EnhancedAchievement {
    const accountAchievement = accountAchievements.find(({ id }) => achievement.id === id);

    const required_achievements: Achievement.V0[] | undefined = prerequisites
      .filter((id) => {
        const accountAchievement = accountAchievements.find((accountAchievement) => accountAchievement.id === id);

        return !accountAchievement?.done;
      })
      .map((id) => prerequisiteAchievements.find((prerequisiteAchievement) => prerequisiteAchievement.id === id)!);

    const tier = tiers.reduce((output, tier) => ({
      count: tier.count,
      points: output.points + tier.points,
    }));

    let progress: EnhancedAchievement['progress'] | undefined;
    if (
      accountAchievement !== undefined &&
      accountAchievement.current !== undefined &&
      accountAchievement.max !== undefined
    ) {
      progress = {
        current: accountAchievement.current,
        max: accountAchievement.max,
        bits: bits?.map((bit, i) => ({
          ...bit,
          done: (accountAchievement.done || accountAchievement.bits.includes(i)) ?? false,
        })),
      };
    } else if (bits) {
      progress = {
        current: 0,
        max: bits.length,
        bits: bits?.map((bit, i) => ({
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

    return {
      ...achievement,
      requirement: progress ? requirement.replace(/\s{2}(times)/gi, ` ${progress.max} $1`) : requirement,
      tier,
      done: accountAchievement?.done ?? false,
      prerequisites: required_achievements.length > 0 ? required_achievements : undefined,
      meta: achievement.flags.includes(Achievement.Flags.CATEGORY_DISPLAY),
      progress,
    };
  }
}

export type ApiError = {
  status: number;
  content: {
    text: string;
  };
};
