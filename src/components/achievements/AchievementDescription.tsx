import { useMemo } from 'react';
import { toast } from 'sonner';

export function AchievementDescription({ description }: AchievementDescription.Props) {
  if (!description) return null;

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

  return <div className="text-shadow-ally text-sm italic text-tui-muted" dangerouslySetInnerHTML={{ __html: html }} />;
}

export namespace AchievementDescription {
  export type Props = {
    description?: string;
  };
}
