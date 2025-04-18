import { useMemo } from 'react';

export function useLinks(
  names: string[],
  priority: UseLinks.CollisionType[] = ['story', 'object']
): Record<string, string> {
  return useMemo(() => {
    return names.reduce<Record<string, string>>((output, name) => {
      output[name] = UseLinks.link(name, priority);

      return output;
    }, {});
  }, [names, priority]);
}

export namespace UseLinks {
  export const story: Record<string, string> = {
    'Heart of the Volcano': 'Heart of the Volcano (story)',
    'Hallowed Ground': 'Hallowed_Ground_(story)',
  };

  export const object: Record<string, string> = {
    'Heart of the Volcano': 'Heart of the Volcano (object)',
  };

  export const collisions = {
    story,
    object,
  };

  export type CollisionType = keyof typeof collisions;

  export function link(name: string, priority: CollisionType[] = ['story', 'object']) {
    const key = priority.find((key) => collisions[key][name]);

    const value = sanitize(key ? collisions[key][name] : name);

    return `https://wiki.guildwars2.com/index.php?title=Special%3ASearch&go=Go&search=${value}`;
  }

  export function sanitize(name: string) {
    return name.replace(/\s/g, '_').replace(/[[\]"]/g, '');
  }
}
