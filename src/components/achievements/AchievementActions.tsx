import type { CategoryAchievement } from '@/service/api';
import { TuiIcon } from '../common/TuiIcon';
import { useAchievementActions } from '@/hooks/use-achievement-actions';

export function AchievementActions({ achievement }: AchievementActions.Props) {
  const actions = useAchievementActions(achievement);

  return (
    <div className="flex gap-2">
      {actions.map((action, i) => (
        <a key={i} href={action.href} target="_blank">
          <TuiIcon icon={action.icon} />
        </a>
      ))}
    </div>
  );
}

export namespace AchievementActions {
  export type Props = {
    achievement: CategoryAchievement;
  };
}
