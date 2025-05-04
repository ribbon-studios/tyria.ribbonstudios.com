import { UseEnhancedAchievements } from '@/hooks/use-enhanced-achievements';
import { describe, expect, it } from 'vitest';

describe('useEnhancedAchievements', () => {
  describe('UseEnhancedAchievements', () => {
    const { process } = UseEnhancedAchievements;

    describe('process', () => {
      const { description } = process;

      describe('fn(description)', () => {
        it('should handle descriptions with quotes', () => {
          const value = 'Story Instance: "Old Friends"';

          expect(description(value)).toEqual({
            description: value,
            stories: ['Old Friends'],
          });
        });

        it('should handle descriptions with punctuation', () => {
          const value = "Journal: Can't Trust a Pirate Completed";

          expect(description(value)).toEqual({
            description: value,
            stories: ["Can't Trust a Pirate"],
          });
        });

        it('should handle journal entries that end with "Completed"', () => {
          const value = 'Journal: Outreach Completed';

          expect(description(value)).toEqual({
            description: value,
            stories: ['Outreach'],
          });
        });

        it('should handle multi line descriptions', () => {
          const value = `Story Instance: Pointed Parley<br><br>It's like herding cats, but the cats carry flamesaws.`;

          expect(description(value)).toEqual({
            description: value,
            stories: ['Pointed Parley'],
          });
        });
      });
    });
  });
});
