import { cn } from '@/utils/cn';
import { useMemo } from 'react';
import { toast } from 'sonner';

export function AchievementDescription({ description }: AchievementDescription.Props) {
  const [parsedDescription, stylingClassName] = useMemo<[string, string | null]>(() => {
    const [, tag, parsedDescription] = description.match(/^(?:<c=([^>]+)>)?([^<]+)(?:<\/c>)?$/) ?? [
      null,
      null,
      description,
    ];

    switch (tag?.toLowerCase()) {
      case '@flavor':
        return [parsedDescription, 'text-cyan-200'];
      case null:
      case undefined:
        return [parsedDescription, 'text-white/60'];
      default:
        toast.warning(`The description of an achievement contained an unhanded formatting tag. (${tag})`);
        return [parsedDescription, 'text-white/60'];
    }
  }, [description]);

  return <div className={cn('text-sm italic', stylingClassName)}>{parsedDescription}</div>;
}

export namespace AchievementDescription {
  export type Props = {
    description: string;
  };
}
