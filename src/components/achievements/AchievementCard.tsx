import { cn } from '@/utils/cn';
import type { EnhancedAchievement } from '@/service/api';
import { Card } from '../common/Card';
import * as styles from './AchievementCard.module.css';
import React from 'react';
import { AchievementActions } from './AchievementActions';
import { useSelector } from 'react-redux';
import { selectSettings } from '@/store/settings.slice';
import { DebugInfo } from '../DebugInfo';
import { Link } from 'react-router-dom';
import { AchievementDescription } from './AchievementDescription';
import { AchievementProgress } from './AchievementProgress';

export function AchievementCard({ achievement, className }: AchievementCard.Props) {
  const settings = useSelector(selectSettings);

  if (settings.toggles.hide_completed_achievements && achievement.done) return null;

  return (
    <Card
      className={cn(styles.achievementCard, achievement.meta && styles.meta, className)}
      icon={achievement.icon}
      splash={
        achievement.icon
          ? {
              image: achievement.icon,
              grayscale: !achievement.done,
            }
          : undefined
      }
    >
      <div className={styles.content}>
        <div className="flex justify-between items-start">
          <div className="font-bold">{achievement.name}</div>
          <div className="flex gap-2">
            <DebugInfo as={Link} to={`/achievements/${achievement.id}`}>
              {achievement.id}
            </DebugInfo>
            <AchievementActions achievement={achievement} />
          </div>
        </div>
        <div className={styles.info}>
          <div className="text-sm text-white/80">{achievement.requirement}</div>
          <AchievementDescription description={achievement.description} />
          {!achievement.done && (
            <>
              <AchievementProgress progress={achievement.progress} />

              {achievement.prerequisites && (
                <div className="flex flex-col gap-1 italic text-sm text-white/60">
                  <div>Prerequisites:</div>
                  {achievement.prerequisites.map((prerequisite) => (
                    <React.Fragment key={prerequisite.id}>{prerequisite.name}</React.Fragment>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

export namespace AchievementCard {
  export type Props = {
    achievement: EnhancedAchievement;
    className?: string;
  };
}
