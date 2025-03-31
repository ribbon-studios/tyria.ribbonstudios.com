import type { EnhancedAchievement } from '@/service/api';
import { TuiIcon } from '../common/TuiIcon';
import { useAchievementActions } from '@/hooks/use-achievement-actions';

export function AchievementActions({ achievement }: AchievementActions.Props) {
  const actions = useAchievementActions(achievement);

  if (actions.length === 0) return null;

  return (
    <div className="flex gap-2">
      {actions.map(({ href, icon, ...props }, i) =>
        href ? (
          <a key={i} {...props} href={href} target="_blank">
            <TuiIcon icon={icon} />
          </a>
        ) : (
          <div key={i} {...props}>
            <TuiIcon icon={icon} />
          </div>
        )
      )}
    </div>
  );
}

export namespace AchievementActions {
  export type Props = {
    achievement: EnhancedAchievement;
  };
}
