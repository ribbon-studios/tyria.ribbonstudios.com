import { cn } from '@/utils/cn';
import { TuiCard } from '../common/TuiCard';
import * as styles from './AchievementCard.module.css';
import { AchievementActions } from './AchievementActions';
import { $toggles } from '@/store/settings';
import { DebugInfo } from '../DebugInfo';
import { Link } from 'react-router-dom';
import { AchievementDescription } from './AchievementDescription';
import { AchievementProgress } from './AchievementProgress';
import { AutoLink } from '../AutoLink';
import { Achievement } from '@ribbon-studios/guild-wars-2/v2';
import type { UseEnhancedAchievements } from '@/hooks/use-enhanced-achievements';
import { useStore } from '@nanostores/react';

export function AchievementCard({ achievement, className, basic }: AchievementCard.Props) {
  const toggles = useStore($toggles);

  if (toggles.hide_completed_achievements && achievement.done) return null;
  if (toggles.hide_hidden_achievements && achievement.flags.includes(Achievement.Flags.HIDDEN)) return null;

  return (
    <TuiCard
      className={cn(styles.achievementCard, !basic && achievement.meta && styles.meta, className)}
      contentClassName={styles.achievementCardContent}
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
      <div className="flex justify-between items-center">
        <div className="font-bold text-shadow-ally">{achievement.name}</div>
        <div className="flex gap-2">
          <DebugInfo as={Link} to={`/achievements/${achievement.id}`}>
            {achievement.id}
          </DebugInfo>
          <AchievementActions achievement={achievement} />
        </div>
      </div>
      <div className="flex flex-col justify-between gap-2">
        {achievement.requirement && <AutoLink className="text-sm text-shadow-ally">{achievement.requirement}</AutoLink>}
        <AchievementDescription description={achievement.description} />

        {achievement.prerequisites && (
          <div className="flex flex-col gap-1 italic text-sm text-white/60">
            <div>
              Prerequisites: {`"${achievement.prerequisites.map((prerequisite) => prerequisite.name).join('", "')}"`}
            </div>
          </div>
        )}

        {!achievement.done && <AchievementProgress progress={achievement.progress} tiers={achievement.tiers} />}
      </div>
    </TuiCard>
  );
}

export namespace AchievementCard {
  export type Props = {
    achievement: UseEnhancedAchievements.Achievement;
    className?: string;
    basic?: boolean;
  };
}
