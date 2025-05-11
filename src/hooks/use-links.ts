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
    'Hallowed Ground': 'Hallowed Ground (story)',
    'Darkrime Delves': 'Darkrime Delves (story)',
    Dragonstorm: 'Dragonstorm (story)',
    Wildfire: 'Wildfire (story)',
    Convergence: 'Convergence (story)',
    'Deep Trouble': 'Deep Trouble (story)',
    'Uncertain Times': 'Prologue: Uncertain Times',
    'The World Spire': 'The World Spire (story)',
    'The War Council': 'The War Council (story)',
  };

  export const strike: Record<string, string> = {
    'Shiverpeaks Pass': 'Strike Mission: Shiverpeaks Pass',
    Boneskinner: 'Weekly Strike Mission: Boneskinner',
    'Whisper of Jormag': 'Strike Mission: Whisper of Jormag',
    'Cold War': 'Strike Mission: Cold War',
    'Fraenir of Jormag': 'Weekly Strike Mission: Fraenir of Jormag',
    'Voice of the Fallen and Claw of the Fallen': 'Weekly Strike Mission: Voice of the Fallen and Claw of the Fallen',
  };

  export const object: Record<string, string> = {
    'Heart of the Volcano': 'Heart of the Volcano (object)',
  };

  export const collisions = {
    story,
    strike,
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
