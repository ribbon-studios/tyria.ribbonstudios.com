import type { UseEnhancedAchievements } from '@/hooks/use-enhanced-achievements';
import type { CustomChance } from '.';
import { Achievement } from '@ribbon-studios/guild-wars-2/v2';

export type IChanceAchievements = {
  achievement: (
    this: CustomChance,
    overrides?: Partial<UseEnhancedAchievements.Achievement>
  ) => UseEnhancedAchievements.Achievement;
  achievements: (
    this: CustomChance,
    count: number | [number, number],
    overrides?: Partial<UseEnhancedAchievements.Achievement>
  ) => UseEnhancedAchievements.Achievement[];

  achievement_flag: (this: CustomChance) => Achievement.Flags;
  achievement_flags: (this: CustomChance) => Achievement.Flags;

  achievement_type: (this: CustomChance) => Achievement.Type;

  achievement_tier: (this: CustomChance, overrides?: Partial<Achievement.Tier>) => Achievement.Tier;
  achievement_tiers: (
    this: CustomChance,
    count: number | [number, number],
    overrides?: Partial<Achievement.Tier>
  ) => Achievement.Tier[];
};

export const mixin: IChanceAchievements = {
  achievement: function (this: CustomChance, overrides?: Partial<UseEnhancedAchievements.Achievement>) {
    return {
      id: this.integer(),
      name: this.word(),
      type: this.achievement_type(),
      description: this.sentence(),
      done: this.bool(),
      flags: [this.achievement_flags()],
      locked_text: this.sentence(),
      requirement: this.sentence(),
      tier: this.achievement_tier(),
      tiers: this.achievement_tiers(3),
      ...overrides,
    };
  },

  achievements: function (count, overrides) {
    return this.n(() => this.achievement(overrides), this.count(count));
  },

  achievement_flag: function () {
    return this.pickone(Object.values(Achievement.Flags));
  },

  achievement_flags: function () {
    return this.pickone(Object.values(Achievement.Flags));
  },

  achievement_type: function () {
    return this.pickone(Object.values(Achievement.Type));
  },

  achievement_tier: function (overrides) {
    return {
      count: this.integer({ min: 1 }),
      points: this.integer({ min: 0 }),
      ...overrides,
    };
  },

  achievement_tiers: function (count, overrides) {
    return this.n(() => this.achievement_tier(overrides), this.count(count));
  },
};
