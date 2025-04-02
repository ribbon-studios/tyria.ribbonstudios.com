import { Loading } from '@/components/common/Loading';
import type { AchievementProgress } from '../AchievementProgress';
import { MiniBits } from './MiniBits';
import { TextBits } from './TextBits';
import { ItemBits } from './ItemBits';
import { SkinBits } from './SkinBits';

export function AchievementBits({ bits, loading = false }: AchievementBits.Props) {
  if (!bits) return null;

  return (
    <Loading className="min-w-10 min-h-10" contentClassName="gap-2" loading={loading}>
      <SkinBits bits={bits.skins} />
      <ItemBits bits={bits.items} />
      <MiniBits bits={bits.minis} />
      <TextBits bits={bits.text} />
    </Loading>
  );
}

export namespace AchievementBits {
  export type Props = {
    bits?: AchievementProgress.GetBitsResponse;
    loading?: boolean;
  };
}
