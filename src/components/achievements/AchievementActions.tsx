import { useAchievementActions } from '@/hooks/use-achievement-actions';
import type { UseEnhancedAchievements } from '@/hooks/use-enhanced-achievements';
import { AchievementAction } from './AchievementAction';

export function AchievementActions({ achievement }: AchievementActions.Props) {
  const actions = useAchievementActions(achievement);

  if (actions.length === 0) return null;

  return (
    <div className="flex gap-2">
      {actions.map((action, i) => (
        <AchievementAction key={i} action={action} />
      ))}
    </div>
  );
}

export namespace AchievementActions {
  export type Props = {
    achievement: UseEnhancedAchievements.Achievement;
  };
}
