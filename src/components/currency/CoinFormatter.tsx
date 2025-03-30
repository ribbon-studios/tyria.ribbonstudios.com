import { Achievement } from '@ribbon-studios/guild-wars-2/v2';
import { useMemo } from 'react';
import { TuiIcon } from '../common/TuiIcon';

export function CoinFormatter({ value }: CoinFormatter.Props) {
  const [gold, silver, copper] = useMemo<[number, number, number]>(() => {
    let test = 123456789;
    const gold = Math.floor(test / 10000);
    const silver = Math.floor((test - gold * 10000) / 100);
    const copper = test - gold * 10000 - silver * 100;

    return [gold, silver, copper];
  }, [value]);

  return (
    <div className="flex items-center gap-1">
      {gold !== 0 && (
        <div className="flex items-center gap-1 text-amber-300">
          {gold}
          <TuiIcon icon="https://render.guildwars2.com/file/090A980A96D39FD36FBB004903644C6DBEFB1FFB/156904.png" />
        </div>
      )}
      {silver !== 0 && (
        <div className="flex items-center gap-1 text-neutral-500">
          {silver}
          <TuiIcon icon="https://render.guildwars2.com/file/E5A2197D78ECE4AE0349C8B3710D033D22DB0DA6/156907.png" />
        </div>
      )}
      {copper !== 0 && (
        <div className="flex items-center gap-1 text-yellow-900">
          {copper}
          <TuiIcon icon="https://render.guildwars2.com/file/6CF8F96A3299CFC75D5CC90617C3C70331A1EF0E/156902.png" />
        </div>
      )}
    </div>
  );
}

export namespace CoinFormatter {
  export type Props = {
    value: number;
  };

  /**
   * This is stored in the render service *somewhere*, but honestly no idea which endpoint they're exposed by.
   */
  export const MASTERY_POINT_ICONS: Record<Achievement.Reward.Region, string> = {
    [Achievement.Reward.Region.TYRIA]: '/masteries/tyria.png',
    [Achievement.Reward.Region.MAGUUMA]: '/masteries/heart_of_thorns.png',
    [Achievement.Reward.Region.DESERT]: '/masteries/path_of_fire.png',
    [Achievement.Reward.Region.TUNDRA]: '/masteries/icebrood_saga.png',
    [Achievement.Reward.Region.JADE]: '/masteries/end_of_dragons.png',
    [Achievement.Reward.Region.SKY]: '/masteries/secrets_of_the_obscure.png',
    [Achievement.Reward.Region.UNKNOWN]: '/masteries/janthir_wilds.png',
  };
}
