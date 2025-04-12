import { TuiIcon } from '@/components/common/TuiIcon';
import { TuiLink } from '@/components/common/TuiLink';
import { TuiTooltip } from '@/components/common/TuiTooltip';
import type { AchievementProgress } from '../AchievementProgress';
import { UseLinks } from '@/hooks/use-links';
import { cn } from '@/utils/cn';

export function IconBit({ bit }: IconBit.Props) {
  return (
    <TuiTooltip
      tooltip={
        <div className="flex flex-col">
          <div className="text-nowrap font-bold">{bit.name}</div>
          {bit.hint && <div className="text-tui-muted italic">{bit.hint}</div>}
        </div>
      }
    >
      <TuiLink to={UseLinks.link(bit.name)} className="rounded-sm overflow-hidden" target="_blank" overlay>
        <TuiIcon icon={bit.icon} size={48} className={cn(['rounded-md', !bit.done && 'grayscale'])} />
      </TuiLink>
    </TuiTooltip>
  );
}

export namespace IconBit {
  export type Props = {
    bit: AchievementProgress.IconBit;
  };
}
