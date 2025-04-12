import { Loading } from '@/components/common/Loading';
import type { AchievementProgress } from '../AchievementProgress';
import { TextBits } from './TextBits';
import { IconBit } from '../AchievementBit/IconBit';
import type { UseEnhancedAchievements } from '@/hooks/use-enhanced-achievements';

export function AchievementBits({ bits, text, loading = false }: AchievementBits.Props) {
  if (!bits && !text) return null;

  return (
    <Loading className="min-w-10 min-h-10" contentClassName="gap-2" loading={loading}>
      {bits && (
        <div className="flex flex-wrap gap-2.5 justify-start">
          {bits.map((bit) => (
            <IconBit key={bit.id} bit={bit} />
          ))}
        </div>
      )}
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
