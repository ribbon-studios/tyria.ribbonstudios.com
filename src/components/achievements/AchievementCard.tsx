import { cn } from '@/utils/cn';
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
import { AutoLink } from '../AutoLink';
import { Achievement } from '@ribbon-studios/guild-wars-2/v2';
import type { UseEnhancedAchievements } from '@/hooks/use-enhanced-achievements';

export function AchievementCard({ achievement, className }: AchievementCard.Props) {
  const settings = useSelector(selectSettings);

  if (settings.toggles.hide_completed_achievements && achievement.done) return null;
  if (settings.toggles.hide_hidden_achievements && achievement.flags.includes(Achievement.Flags.HIDDEN)) return null;

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
          <AutoLink className="text-sm text-white/80">{achievement.requirement}</AutoLink>
          <AchievementDescription description={achievement.description} />
          {!achievement.done && (
            <>
              <AchievementProgress progress={achievement.progress} tiers={achievement.tiers} />

              {achievement.prerequisites && (
                <div className="flex flex-col gap-1 italic text-sm text-white/60">
                  <div>
                    Prerequisites:{' '}
                    {`"${achievement.prerequisites.map((prerequisite) => prerequisite.name).join('", "')}"`}
                  </div>
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
    achievement: UseEnhancedAchievements.Achievement;
    className?: string;
  };
}
