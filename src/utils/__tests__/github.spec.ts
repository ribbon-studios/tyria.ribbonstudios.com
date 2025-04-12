import { describe, it, expect, expectTypeOf } from 'vitest';
import { chance } from '@/__tests__/chance';
import { commit } from '../github';

describe('GitHub Helpers', () => {
  describe('fn(github)', () => {
    it('should ...', () => {
      const expectedSha = chance.hash();

      const result = commit(expectedSha);

      expect(result).toEqual(`https://github.com/ribbon-studios/tyria.ribbonstudios.com/commit/${expectedSha}`);
      expectTypeOf(result).toEqualTypeOf<string>();
    });
  });
});
