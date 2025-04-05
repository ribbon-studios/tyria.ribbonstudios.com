import type { UseEnhancedAchievements } from '@/hooks/use-enhanced-achievements';
import { MasteryTier } from '@/store/mastery.slice';
import { Achievement } from '@ribbon-studios/guild-wars-2/v2';

export function computeMasteryTier(achievements: UseEnhancedAchievements.Achievement[]): MasteryTier | undefined {
  if (achievements.length === 0) return;

  if (achievements.every(({ done }) => done)) {
    return MasteryTier.TRUE;
  }

  const metas = achievements.filter(({ flags }) => flags.includes(Achievement.Flags.CATEGORY_DISPLAY));

  if (metas.length === 0 || metas.some(({ done }) => !done)) return;

  return MasteryTier.META;
}
