import type { UseEnhancedAchievements } from '@/hooks/use-enhanced-achievements';
import { MasteryTier } from '@/store/mastery.slice';

export function computeMasteryTier(achievements: UseEnhancedAchievements.Achievement[]): MasteryTier | undefined {
  if (achievements.length === 0) return;

  if (achievements.every(({ done }) => done)) {
    return MasteryTier.TRUE;
  }

  const metas = achievements.filter(({ meta }) => meta);

  if (metas.length === 0 || metas.some(({ done }) => !done)) return;

  return MasteryTier.META;
}
