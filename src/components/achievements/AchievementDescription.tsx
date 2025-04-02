import { cn } from '@/utils/cn';
import { useMemo } from 'react';
import { toast } from 'sonner';

export function AchievementDescription({ description }: AchievementDescription.Props) {
  const html = useMemo<string>(() => {
    return description.replaceAll(/<c=([^>]+)>(.+)<\/c>/g, (match, tag, text) => {
      switch (tag?.toLowerCase()) {
        case '@flavor':
          return `<div class="text-cyan-200">${text}</div>`;
        default:
          toast.warning(`The description of an achievement contained an unhanded formatting tag. (${tag})`);
          return match;
      }
    });
  }, [description]);

  return <div className="text-sm italic text-white/60" dangerouslySetInnerHTML={{ __html: html }} />;
}

export namespace AchievementDescription {
  export type Props = {
    description: string;
  };
}
