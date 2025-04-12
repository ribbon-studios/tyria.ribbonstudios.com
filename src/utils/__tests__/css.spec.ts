import { describe, it, expect, expectTypeOf } from 'vitest';
import { variable } from '../css';
import { chance } from '@/__tests__/chance';

describe('CSS Helpers', () => {
  describe('fn(variable)', () => {
    it('should support creating a css variable reference', () => {
      const expectedName = chance.word();

      const result = variable(expectedName);

      expect(result).toEqual(`var(--${expectedName})`);
      expectTypeOf(result).toEqualTypeOf<string>();
    });

    it.each([undefined, null])('should support "%s"', (value) => {
      const result = variable(value);

      expect(result).toEqual(undefined);
      expectTypeOf(result).toEqualTypeOf<string | undefined>();
    });
  });

  describe('fn(variable.tui)', () => {
    it('should be a shorthand for tui css variables', () => {
      const expectedColor = chance.colors();

      const result = variable.tui(expectedColor);

      expect(result).toEqual(`var(--color-tui-${expectedColor})`);
      expectTypeOf(result).toEqualTypeOf<string>();
    });

    it.each([undefined, null])('should support "%s"', (value) => {
      const result = variable.tui(value);

      expect(result).toEqual(undefined);
      expectTypeOf(result).toEqualTypeOf<string | undefined>();
    });
  });
});
