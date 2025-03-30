import type { EnhancedAchievement } from '@/service/api';
import { type LucideIcon } from 'lucide-react';
import { useMemo } from 'react';

export function useAchievementActions(achievement: EnhancedAchievement) {
  return useMemo(() => {
    let output: UseAchievementActions.Action[] = [];

    output = output.concat(UseAchievementActions.getDescriptionActions(achievement));
    output = output.concat(UseAchievementActions.getPrerequisiteActions(achievement));

    return output;
  }, [achievement]);
}

export namespace UseAchievementActions {
  export enum Type {
    STORY = 'Story Instance:',
    PREREQUISITE = 'Prerequisite',
  }

  export namespace Type {
    export function is(value: any): value is Type {
      return Object.values(Type).includes(value);
    }
  }

  export type Action = {
    type: string;
    icon: string | LucideIcon;
    href: string;
  };

  export const TypeLinkMap: Record<Exclude<Type, Type.PREREQUISITE>, (name: string) => string> = {
    [Type.STORY]: (name: string) => `https://wiki.guildwars2.com/wiki/${sanitize(name)}`,
  };

  export const TypeIconMap: Record<Type, Action['icon']> = {
    [Type.STORY]: 'https://render.guildwars2.com/file/540BA9BB6662A5154BD13306A1AEAD6219F95361/102369.png',
    [Type.PREREQUISITE]: '/lock.png',
  };

  function sanitize(name: string) {
    const result = name.replace(/\s/g, '_').replace(/[\[\]"]/g, '');

    return result.split('—')[0];
  }

  export function getDescriptionActions(achievement: EnhancedAchievement): Action[] {
    if (!achievement.description) return [];

    const [, ...matches] = achievement.description.match(/([^:]+:)(.*)/) ?? [];

    if (matches.length !== 2) return [];

    const [type, name] = matches.map((match) => match.trim());

    if (!UseAchievementActions.Type.is(type) || type === Type.PREREQUISITE) return [];

    return [
      {
        type,
        icon: UseAchievementActions.TypeIconMap[type],
        href: UseAchievementActions.TypeLinkMap[type](name),
      },
    ];
  }

  export function getPrerequisiteActions(achievement: EnhancedAchievement): Action[] {
    if (!achievement.prerequisites) return [];

    const type = UseAchievementActions.Type.PREREQUISITE;

    return achievement.prerequisites.map((prerequisite) => ({
      type,
      icon: UseAchievementActions.TypeIconMap[type],
      href: `/achievements/${prerequisite.id}`,
    }));
  }
}
