import type { AchievementProgress } from '../AchievementProgress';
import { LucideCheckCircle2, LucideXCircle } from 'lucide-react';

export function SkinBits({ bits }: SkinBits.Props) {
  if (!bits || bits.length === 0) return null;

  return (
    <>
      <div className="font-bold">Skins</div>
      <div className="flex flex-wrap gap-2.5 justify-start">
        {bits.map((bit, index) => (
          <div key={index} className="flex gap-2 items-center">
            {bit.done ? (
              <LucideCheckCircle2 className="text-tui-success" />
            ) : (
              <LucideXCircle className="text-tui-error" />
            )}
            {bit.id}
          </div>
        ))}
      </div>
    </>
  );
}

export namespace SkinBits {
  export type Props = {
    bits?: AchievementProgress.GetBitsResponse['skins'];
  };
}
