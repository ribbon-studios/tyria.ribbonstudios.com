import { describe, it, expect, expectTypeOf } from 'vitest';
import { variable } from '../css';
import { chance } from '@/__tests__/chance';
import { json } from '../parsers';

describe('Parser', () => {
  describe('fn(json)', () => {
    it('should support parsing json', () => {
      const expectedValue = {
        hello: 'world',
      };

      const result = json<typeof expectedValue>(JSON.stringify(expectedValue));

      expect(result).toEqual(expectedValue);
      expectTypeOf(result).toEqualTypeOf<typeof expectedValue | undefined>();
    });

    it('should support undefined values', () => {
      const result = json(undefined);

      expect(result).toEqual(undefined);
      expectTypeOf(result).toEqualTypeOf<any>();
    });

    it('should support default values', () => {
      const expectedValue = {
        hello: 'world',
      };

      const result = json<typeof expectedValue>(undefined, expectedValue);

      expect(result).toEqual(expectedValue);
      expectTypeOf(result).toEqualTypeOf<typeof expectedValue>();
    });

    it('should fallback to the default value when provided with invalid json', () => {
      const expectedValue = {
        hello: 'welt',
      };

      const result = json<{ hello: string }>("{ hello: 'world', }", expectedValue);

      expect(result).toEqual(expectedValue);
      expectTypeOf(result).toEqualTypeOf<typeof expectedValue>();
    });

    it('should support invalid json', () => {
      const result = json("{ hello: 'world', }");

      expect(result).toEqual(undefined);
    });
  });
});
