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
      ...UseAchievementActions.overrides.get(achievement.id),
      ...UseAchievementActions.getDescriptionActions(achievement),
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
    STORY = 'Story Instance:',
    PREREQUISITE = 'Prerequisite',
    LOCKED = 'Locked',
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

  export function getDescriptionActions(achievement: UseEnhancedAchievements.Achievement): Action[] {
    if (!achievement.description) return [];

    const [, ...matches] = achievement.description.match(/([^:]+:)([^<]+)/) ?? [];

    if (matches.length !== 2) return [];

    const [type, name] = matches.map((match) => match.trim());

    if (!UseAchievementActions.Type.is(type) || type === Type.PREREQUISITE) return [];

    return [UseAchievementActions.TypeMap[type](name)];
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

  export namespace overrides {
    export function get(id: number): Action[] {
      const stories = Object.entries(story).filter(([, ids]) => ids.includes(id));

      return stories.map(([story]) => TypeMap[Type.STORY](story));
    }

    const story: Record<string, number[]> = {
      // 5234 should be in both of these lists, but currently we don't support multiple story missions
      'Forging Steel': [
        5178, 5191, 5205, 5223, 5228, 5217, 5230, 5202, 5182, 5222, 5200, 5227, 5225, 5189, 5197, 5212, 5214,
      ],
      'Darkrime Delves': [5192, 5209, 5181],
    };
  }
}
