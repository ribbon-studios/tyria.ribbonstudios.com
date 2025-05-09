import { describe, it, expect } from 'vitest';
import { formatter } from '../formatter';

describe('Formatter Utils', () => {
  describe('fn(sanitize)', () => {
    it('should replace special characters', () => {
      expect(formatter('šžþàáâãäåçèéêëìíîïðñòóôõöùúûüý').sanitize.value()).toEqual('szyaaaaaaceeeeiiiidnooooouuuuy');
    });

    it('should leave normal characters alone', () => {
      expect(formatter('hello world').sanitize.value()).toEqual('hello world');
    });
  });

  describe('fn(lower)', () => {
    it('should lowercase the values', () => {
      expect(formatter('Hello World').lower.value()).toEqual('hello world');
    });
  });

  describe('fn(upper)', () => {
    it('should uppercase the values', () => {
      expect(formatter('Hello World').upper.value()).toEqual('HELLO WORLD');
    });
  });

  describe('fn(simplify)', () => {
    it('should remove special characters from the string', () => {
      expect(
        formatter('This is a "very" complex sentence that wouldn\'t match in most cases.').simplify.value()
      ).toEqual('This is a very complex sentence that wouldnt match in most cases');
    });
  });

  describe('fn(value)', () => {
    it('should return the adjusted value', () => {
      expect(formatter('Hello World').upper.value()).toEqual('HELLO WORLD');
    });

    it('should return the value that was provided', () => {
      expect(formatter('Hello World').value()).toEqual('Hello World');
    });
  });
});
