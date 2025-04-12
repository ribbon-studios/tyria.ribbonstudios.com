import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

import { type FC } from 'react';

export type InputProps = {
  loading?: boolean;
};

export const SaveIndicator: FC<InputProps> = ({ loading }) => {
  return (
    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
      <Loader2 className={cn('opacity-0 animate-spin', loading && 'opacity-80')} />
      {/* <Check className="opacity-80 scale-125" /> */}
    </div>
  );
};
