import type { ComponentProps } from 'react';
import { TuiIcon } from '../common/TuiIcon';
import { MasteryTier } from '@/store/mastery.slice';
import { cn } from '@/utils/cn';

export function MasteryIcon({ masteryTier, size = 36, className, ...props }: MasteryIcon.Props) {
  if (masteryTier === undefined) return;

  return (
    <TuiIcon
      {...props}
      className={cn(MasteryIcon.MASTERY_CLASSES[masteryTier], className)}
      icon="https://render.guildwars2.com/file/5A4E663071250EC72668C09E3C082E595A380BF7/528724.png"
      size={size}
      title={MasteryIcon.MASTERY_TOOLTIP[masteryTier]}
    />
  );
}

export namespace MasteryIcon {
  export type Props = {
    masteryTier?: MasteryTier;
  } & Omit<ComponentProps<typeof TuiIcon>, 'icon'>;

  export const MASTERY_TOOLTIP: Partial<Record<MasteryTier, string>> = {
    [MasteryTier.META]: 'Meta Mastery',
  };

  export const MASTERY_CLASSES: Partial<Record<MasteryTier, string>> = {
    [MasteryTier.META]: 'grayscale',
  };
}
