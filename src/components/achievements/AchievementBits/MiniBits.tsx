import { TuiIcon } from '@/components/common/TuiIcon';
import { TuiLink } from '@/components/common/TuiLink';
import { TuiTooltip } from '@/components/common/TuiTooltip';
import { MiniTooltip } from '../tooltips/MiniTooltip';
import type { AchievementProgress } from '../AchievementProgress';

export function MiniBits({ bits }: MiniBits.Props) {
  if (!bits || bits.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2.5 justify-start">
      {bits.map((mini, index) => (
        <TuiTooltip key={index} tooltip={<MiniTooltip mini={mini} />}>
          <TuiLink
            to={`https://wiki.guildwars2.com/wiki/${mini.name?.replace(/\s/g, '_')}`}
            className="rounded-sm overflow-hidden"
            target="_blank"
            overlay
          >
            <TuiIcon icon={mini.icon} size={48} className={mini.done ? undefined : 'grayscale'} />
          </TuiLink>
        </TuiTooltip>
      ))}
    </div>
  );
}

export namespace MiniBits {
  export type Props = {
    bits?: AchievementProgress.GetBitsResponse['minis'];
  };
}
