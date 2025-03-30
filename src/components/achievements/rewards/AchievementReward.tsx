import { TuiIcon } from '@/components/common/TuiIcon';
import { CoinFormatter } from '@/components/currency/CoinFormatter';
import { Achievement } from '@ribbon-studios/guild-wars-2/v2';

export function AchievementReward({ reward }: AchievementReward.Props) {
  if (reward.type == Achievement.Reward.Type.COINS) {
    return <CoinFormatter value={reward.count} />;
  }

  if (reward.type == Achievement.Reward.Type.TITLE) {
    return <div>Title: {reward.id}</div>;
  }

  if (reward.type === Achievement.Reward.Type.MASTERY) {
    const icon = AchievementReward.MASTERY_POINT_ICONS[reward.region];

    return <TuiIcon icon={icon} size={32} />;
  }

  if (reward.type === Achievement.Reward.Type.ITEM) {
    return (
      <div className="flex flex-col gap-2 p-4 leading-none bg-tui-light-gray rounded-lg">
        <div>Item</div>
        {reward.id}
      </div>
    );
  }

  return null;
}

export namespace AchievementReward {
  export type Props = {
    reward: Achievement.Reward;
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
