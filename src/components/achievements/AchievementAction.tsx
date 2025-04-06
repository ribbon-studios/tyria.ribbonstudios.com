import { TuiIcon } from '../common/TuiIcon';
import { UseAchievementActions } from '@/hooks/use-achievement-actions';
import { TuiTooltip } from '../common/TuiTooltip';
import { useMemo } from 'react';

export function AchievementAction({ action: { icon, tooltip, ...action } }: AchievementActions.Props) {
  const Component = action.href ? 'a' : 'div';

  const target = useMemo(() => {
    if (!action.href) return undefined;

    return action.href.startsWith(location.origin) || action.href.startsWith('/') ? undefined : '_blank';
  }, [action.href]);

  if (tooltip) {
    return (
      <TuiTooltip tooltip={tooltip} tooltipClassName="whitespace-nowrap" position="left" align="center" offset={6}>
        <Component {...action} target={target}>
          <TuiIcon icon={icon} />
        </Component>
      </TuiTooltip>
    );
  }

  return (
    <Component {...action} target={target}>
      <TuiIcon icon={icon} />
    </Component>
  );
}

export namespace AchievementActions {
  export type Props = {
    action: UseAchievementActions.Action;
  };
}
