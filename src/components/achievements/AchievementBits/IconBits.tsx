import type { AchievementProgress } from '../AchievementProgress';
import { IconBit } from '../AchievementBit/IconBit';

export function IconBits({ bits }: IconBits.Props) {
  if (!bits) return null;

  return (
    <>
      <div className="font-light text-lg">Collection</div>
      <div className="flex flex-wrap gap-2.5 justify-start">
        {bits.map((bit) => (
          <IconBit key={bit.id} bit={bit} />
        ))}
      </div>
    </>
  );
}

export namespace IconBits {
  export type Props = {
    bits?: AchievementProgress.IconBit[];
  };

  export type BitsByProgress = {
    done: AchievementProgress.IconBit[];
    not_done: AchievementProgress.IconBit[];
  };
}
