import { createRandomString } from '../src';

const VALID_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

describe('createRandomString', () => {
  it('returns empty string for length 0', () => {
    expect(createRandomString(0)).toBe('');
  });

  it('returns empty string for negative length', () => {
    expect(createRandomString(-5)).toBe('');
  });

  it('returns a string of length 1 with a valid character', () => {
    const result = createRandomString(1);
    expect(result.length).toBe(1);
    expect(VALID_CHARS).toContain(result);
  });

  it('returns a string of the correct length for length 10', () => {
    const result = createRandomString(10);
    expect(result.length).toBe(10);
  });

  it('returns a string of the correct length for length 100', () => {
    const result = createRandomString(100);
    expect(result.length).toBe(100);
  });

  it('all characters are within the valid charset for length 100', () => {
    const result = createRandomString(100);
    for (const char of result) {
      expect(VALID_CHARS).toContain(char);
    }
  });

  it('all characters are within the valid charset for length 500', () => {
    const result = createRandomString(500);
    for (const char of result) {
      expect(VALID_CHARS).toContain(char);
    }
  });

  it('different calls produce different results', () => {
    const results = new Set<string>();
    for (let i = 0; i < 10; i++) {
      results.add(createRandomString(20));
    }
    // With 20-char random strings, 10 calls should produce at least 2 unique values
    expect(results.size).toBeGreaterThan(1);
  });

  it('returns correct length for length 1000', () => {
    const result = createRandomString(1000);
    expect(result.length).toBe(1000);
  });

  it('produces only lowercase letters and digits', () => {
    const result = createRandomString(200);
    expect(result).toMatch(/^[a-z0-9]+$/);
  });

  it('returns a string type', () => {
    const result = createRandomString(5);
    expect(typeof result).toBe('string');
  });
});
