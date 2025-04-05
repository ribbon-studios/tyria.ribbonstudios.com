import { AutoLink } from '@/components/AutoLink';
import type { AchievementProgress } from '../AchievementProgress';
import { LucideCheckCircle2, LucideXCircle } from 'lucide-react';
import { TuiIcon } from '@/components/common/TuiIcon';

export function TextBits({ bits }: TextBits.Props) {
  if (!bits || bits.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 bg-tui-light-gray p-2 rounded-md">
      {bits.map((bit, index) => (
        <div key={index} className="flex gap-2 items-start">
          {bit.done ? (
            <TuiIcon className="text-tui-success" icon={LucideCheckCircle2} />
          ) : (
            <TuiIcon className="text-tui-error" icon={LucideXCircle} />
          )}
          <AutoLink>{bit.text}</AutoLink>
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
