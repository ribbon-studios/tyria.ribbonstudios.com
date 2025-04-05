import { Achievement } from '@ribbon-studios/guild-wars-2/v2';
import { Eye, type LucideIcon } from 'lucide-react';
import { useMemo } from 'react';
import type { UseEnhancedAchievements } from './use-enhanced-achievements';

export function useAchievementActions(achievement: UseEnhancedAchievements.Achievement) {
  return useMemo(() => {
    let output: UseAchievementActions.Action[] = [];

    if (achievement.flags.includes(Achievement.Flags.HIDDEN)) {
      output.push({
        icon: Eye,
        className: 'text-stone-500',
        title: 'Hidden',
      });
    }

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
    icon: string | LucideIcon;
    href?: string;
    className?: string;
    title?: string;
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

  export function getDescriptionActions(achievement: UseEnhancedAchievements.Achievement): Action[] {
    if (!achievement.description) return [];

    const [, ...matches] = achievement.description.match(/([^:]+:)(.*)/) ?? [];

    if (matches.length !== 2) return [];

    const [type, name] = matches.map((match) => match.trim());

    if (!UseAchievementActions.Type.is(type) || type === Type.PREREQUISITE) return [];

    return [
      {
        icon: UseAchievementActions.TypeIconMap[type],
        href: UseAchievementActions.TypeLinkMap[type](name),
      },
    ];
  }

  export function getPrerequisiteActions(achievement: UseEnhancedAchievements.Achievement): Action[] {
    if (!achievement.prerequisites) return [];

    return achievement.prerequisites.map((prerequisite) => ({
      icon: UseAchievementActions.TypeIconMap[UseAchievementActions.Type.PREREQUISITE],
      href: `/achievements/${prerequisite.id}`,
    }));
  }
}
