import { Achievement } from '@ribbon-studios/guild-wars-2/v2';
import { Eye, type LucideIcon } from 'lucide-react';
import { useMemo } from 'react';
import type { UseEnhancedAchievements } from './use-enhanced-achievements';
import { UseLinks } from './use-links';

export function useAchievementActions(achievement: UseEnhancedAchievements.Achievement) {
  return useMemo(() => {
    const output: UseAchievementActions.Action[] = [];

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

    return [
      ...output,
      ...UseAchievementActions.getStrikeActions(achievement),
      ...UseAchievementActions.getStoryActions(achievement),
      ...UseAchievementActions.getLockedActions(achievement),
      {
        icon: '/guild-wars-2-logo.png',
        href: url.toString(),
        tooltip: 'Wiki Page',
      },
    ];
  }, [achievement]);
}

export namespace UseAchievementActions {
  export enum Type {
    STORY,
    STRIKE,
    PREREQUISITE,
    LOCKED,
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

  export const TypeMap: Record<Type, (value: string) => Action> = {
    [Type.STORY]: (value) => ({
      icon: 'https://render.guildwars2.com/file/540BA9BB6662A5154BD13306A1AEAD6219F95361/102369.png',
      href: UseLinks.link(value),
      tooltip: `Story: ${value}`,
    }),
    [Type.STRIKE]: (value) => ({
      icon: '/strike-mission.png',
      href: UseLinks.link(value, ['strike', 'story', 'object']),
      tooltip: `Strike Mission: ${value}`,
    }),
    [Type.PREREQUISITE]: (value) => ({
      icon: '/lock.png',
      href: `/achievements/${value}`,
      tooltip: 'Locked Achievement',
    }),
    [Type.LOCKED]: (value) => ({
      icon: '/lock.png',
      tooltip: `To Unlock: ${value}`,
    }),
  };

  export function getStoryActions(achievement: UseEnhancedAchievements.Achievement): Action[] {
    if (!achievement.stories || achievement.stories.length > 1) return [];

    const [story] = achievement.stories;

    return [TypeMap[Type.STORY](story)];
  }

  export function getStrikeActions(achievement: UseEnhancedAchievements.Achievement): Action[] {
    if (!achievement.strikes || achievement.strikes.length > 1) return [];

    const [strike] = achievement.strikes;

    return [TypeMap[Type.STRIKE](strike)];
  }

  export function getLockedActions(achievement: UseEnhancedAchievements.Achievement): Action[] {
    if (achievement.done || achievement.progress?.current) return [];

    if (achievement.prerequisites) {
      return achievement.prerequisites.map((prerequisite) =>
        UseAchievementActions.TypeMap[Type.PREREQUISITE](prerequisite.id.toString())
      );
    } else if (achievement.locked_text) {
      return [UseAchievementActions.TypeMap[Type.LOCKED](achievement.locked_text)];
    }

    return [];
  }
}
