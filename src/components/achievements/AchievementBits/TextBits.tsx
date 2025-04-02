import type { AchievementProgress } from '../AchievementProgress';
import { LucideCheckCircle2, LucideXCircle } from 'lucide-react';

export function TextBits({ bits }: TextBits.Props) {
  if (!bits || bits.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 bg-tui-light-gray p-2 rounded-md">
      {bits.map((bit, index) => (
        <div key={index} className="flex gap-2 items-center">
          {bit.done ? (
            <LucideCheckCircle2 className="text-tui-success" />
          ) : (
            <LucideXCircle className="text-tui-error" />
          )}
          {bit.text}
        </div>
      ))}
    </div>
  );
}

export namespace TextBits {
  export type Props = {
    bits?: AchievementProgress.GetBitsResponse['text'];
  };
}
