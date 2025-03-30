import type { Achievement } from '@ribbon-studios/guild-wars-2/v2';
import type { FC, ReactNode } from 'react';
import { AchievementReward } from './AchievementReward';

export const AchievementRewards: FC<AchievementRewards.Props> = ({ children, rewards }) => {
  if (!rewards) return null;

  return (
    <div className="flex flex-col items-start gap-1">
      {children}
      <div className="flex gap-2 flex-wrap">
        {rewards.map((reward, i) => (
          <AchievementReward key={i} reward={reward} />
        ))}
      </div>
    </div>
  );
};

export namespace AchievementRewards {
  export type Props = {
    children?: ReactNode;
    rewards?: Achievement.Reward[];
  };
}
