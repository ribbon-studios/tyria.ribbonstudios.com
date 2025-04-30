import { describe, it, expect } from 'vitest';
import { chance } from '@/__tests__/chance';
import { computeMasteryTier } from '../achievements';
import { MasteryTier } from '@/store/mastery.slice';

describe('Achievements Helpers', () => {
  describe('fn(computeMasteryTier)', () => {
    it('should return TRUE if all achievements are completed', () => {
      expect(
        computeMasteryTier([
          chance.achievement({
            done: true,
            meta: true,
          }),
          chance.achievement({
            done: true,
            meta: false,
          }),
        ])
      ).toEqual(MasteryTier.TRUE);
    });

    it('should return META if the meta mastery is completed and other achievements are not', () => {
      expect(
        computeMasteryTier([
          chance.achievement({
            done: true,
            meta: true,
          }),
          chance.achievement({
            done: false,
            meta: false,
          }),
        ])
      ).toEqual(MasteryTier.META);
    });

    it('should return undefined if no mastery tiers are met', () => {
      expect(
        computeMasteryTier([
          chance.achievement({
            done: false,
            meta: true,
          }),
          chance.achievement({
            done: false,
            meta: false,
          }),
        ])
      ).toEqual(undefined);
    });

    it('should return undefined if no achievements are provided', () => {
      expect(computeMasteryTier([])).toEqual(undefined);
    });
  });
});
