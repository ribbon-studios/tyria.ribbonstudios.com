import type { CategoryAchievement } from '@/service/api';
import { Lock, type LucideIcon } from 'lucide-react';
import { useMemo } from 'react';
import { TuiIcon } from '../common/TuiIcon';

const sanitize = (name: string) => {
  return name.replace(/\s/g, '_').replace(/[\[\]]/g, '');
};

export function AchievementActions({ achievement }: AchievementActions.Props) {
  // const lines = useMemo(() => {
  //   if (!description) return null;

  //   const [, ...matches] = description.match(/([^:]+:)(.*)/) ?? [];

  //   if (matches.length) return matches.map((match) => match.trim());

  //   return [description];
  // }, [description]);

  const actions = useMemo(() => {
    const output: AchievementActions.Action[] = [];

    if (achievement.description) {
      const [, ...matches] = achievement.description.match(/([^:]+:)(.*)/) ?? [];

      if (matches.length === 2) {
        const [type, name] = matches.map((match) => match.trim());

        if (AchievementActions.Type.is(type)) {
          output.push({
            type,
            icon: AchievementActions.TypeIconMap[type],
            href: AchievementActions.TypeLinkMap[type](achievement, name),
          });
        }
      }
    }

    if (achievement.prerequisites) {
      const type = AchievementActions.Type.PREREQUISITE;

      output.push(
        ...achievement.prerequisites.map((prerequisite) => ({
          type,
          icon: AchievementActions.TypeIconMap[type],
          href: AchievementActions.TypeLinkMap[type](achievement, prerequisite.name),
        }))
      );
    }

    return output;
  }, [achievement]);

  return (
    <div className="flex gap-2">
      {actions.map((action, i) => (
        <a key={i} href={action.href} target="_blank">
          <TuiIcon icon={action.icon} />
        </a>
      ))}
    </div>
  );
}

export namespace AchievementActions {
  export type Props = {
    achievement: CategoryAchievement;
  };

  export enum Type {
    STORY = 'Story Instance:',
    PREREQUISITE = 'Prerequisite',
  }

  export namespace Type {
    export function is(value: any): value is Type {
      return Object.values(AchievementActions.Type).includes(value);
    }
  }

  export type Action = {
    type: string;
    icon: string | LucideIcon;
    href: string;
  };

  export const TypeLinkMap: Record<Type, (achievement: CategoryAchievement, name: string) => string> = {
    [Type.STORY]: (_, name: string) => `https://wiki.guildwars2.com/wiki/${sanitize(name)}`,
    [Type.PREREQUISITE]: (achievement, name: string) =>
      `https://wiki.guildwars2.com/wiki/${achievement.category}_(achievements)#${sanitize(name)}`,
  };

  export const TypeIconMap: Record<Type, Action['icon']> = {
    [Type.STORY]: 'https://render.guildwars2.com/file/540BA9BB6662A5154BD13306A1AEAD6219F95361/102369.png',
    [Type.PREREQUISITE]: Lock,
  };
}
