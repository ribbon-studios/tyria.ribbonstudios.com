import { Loading } from '@/components/common/Loading';
import type { AchievementProgress } from '../AchievementProgress';
import { TextBits } from './TextBits';
import type { UseEnhancedAchievements } from '@/hooks/use-enhanced-achievements';
import { IconBits } from './IconBits';

export function AchievementBits({ bits, text, loading = false }: AchievementBits.Props) {
  return (
    <Loading className="min-w-10 min-h-10" contentClassName="gap-2" loading={loading} center>
      <IconBits bits={bits} />
      <TextBits bits={text} />
    </Loading>
  );
}

export namespace AchievementBits {
  export type Props = {
    bits?: AchievementProgress.IconBit[];
    text?: UseEnhancedAchievements.Bit.Text[];
    loading?: boolean;
  };
}
