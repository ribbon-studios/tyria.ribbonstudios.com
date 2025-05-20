import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

export function SaveIndicator({ loading }: SaveIndicator.Props) {
  return (
    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
      <Loader2 className={cn('opacity-0 animate-spin', loading && 'opacity-80')} />
      {/* <Check className="opacity-80 scale-125" /> */}
    </div>
  );
}

export namespace SaveIndicator {
  export type Props = {
    loading?: boolean;
  };
}
