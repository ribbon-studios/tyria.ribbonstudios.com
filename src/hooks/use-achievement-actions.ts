import { Achievement } from '@ribbon-studios/guild-wars-2/v2';
import { Eye, Link, type LucideIcon } from 'lucide-react';
import { useMemo } from 'react';
import type { UseEnhancedAchievements } from './use-enhanced-achievements';

export function useAchievementActions(achievement: UseEnhancedAchievements.Achievement) {
  return useMemo(() => {
    let output: UseAchievementActions.Action[] = [];

    const url = new URL('https://wiki.guildwars2.com/index.php');
    url.searchParams.set('title', 'Special:Search');
    url.searchParams.set('go', 'Go');
    url.searchParams.set('search', achievement.name);

    if (achievement.flags.includes(Achievement.Flags.HIDDEN)) {
      output.push({
        icon: Eye,
        className: 'text-stone-500',
        tooltip: 'Hidden Achievement',
      });
    }

    output = output.concat(UseAchievementActions.getDescriptionActions(achievement));
    output = output.concat(UseAchievementActions.getPrerequisiteActions(achievement));

    output.push({
      icon: '/guild-wars-2-logo.png',
      href: url.toString(),
      tooltip: 'Wiki Page',
    });

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
    tooltip?: string;
  };

  export const TypeLinkMap: Record<Exclude<Type, Type.PREREQUISITE>, (name: string) => string> = {
    [Type.STORY]: (name: string) => `https://wiki.guildwars2.com/wiki/${sanitize(name)}`,
  };

  export const TypeMap: Record<Type, (value: string) => Action> = {
    [Type.STORY]: (value) => ({
      icon: 'https://render.guildwars2.com/file/540BA9BB6662A5154BD13306A1AEAD6219F95361/102369.png',
      href: `https://wiki.guildwars2.com/wiki/${sanitize(value)}`,
      tooltip: 'Story Mission',
    }),
    [Type.PREREQUISITE]: (value) => ({
      icon: '/lock.png',
      href: `/achievements/${value}`,
      tooltip: 'Locked Achievement',
    }),
  };

  function sanitize(name: string) {
    const result = name.replace(/\s/g, '_').replace(/[\[\]"]/g, '');

    return result.split('—')[0];
  }

  export function getDescriptionActions(achievement: UseEnhancedAchievements.Achievement): Action[] {
    if (!achievement.description) return [];

    const [, ...matches] = achievement.description.match(/([^:]+:)([^<]+)/) ?? [];

    if (matches.length !== 2) return [];

    const [type, name] = matches.map((match) => match.trim());

    if (!UseAchievementActions.Type.is(type) || type === Type.PREREQUISITE) return [];

    return [UseAchievementActions.TypeMap[type](name)];
  }

  export function getPrerequisiteActions(achievement: UseEnhancedAchievements.Achievement): Action[] {
    if (!achievement.prerequisites) return [];

    return achievement.prerequisites.map((prerequisite) =>
      UseAchievementActions.TypeMap[UseAchievementActions.Type.PREREQUISITE](prerequisite.id.toString())
    );
  }
}
