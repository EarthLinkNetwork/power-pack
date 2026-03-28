import {
  isNullOrEmpty,
  isNullOrWhiteSpace,
  isNotNullOrEmpty,
  isNotNullOrWhiteSpace,
} from '../src';

describe('isNullOrEmpty', () => {
  it('returns true for null', () => {
    expect(isNullOrEmpty(null)).toBe(true);
  });

  it('returns true for undefined', () => {
    expect(isNullOrEmpty(undefined)).toBe(true);
  });

  it('returns true for empty string', () => {
    expect(isNullOrEmpty('')).toBe(true);
  });

  it('returns false for a non-empty string', () => {
    expect(isNullOrEmpty('hello')).toBe(false);
  });

  it('returns false for whitespace-only string (not empty)', () => {
    expect(isNullOrEmpty(' ')).toBe(false);
  });

  it('returns false for a string with content', () => {
    expect(isNullOrEmpty('abc')).toBe(false);
  });

  it('returns false for string with tabs and newlines', () => {
    expect(isNullOrEmpty('\t\n')).toBe(false);
  });

  it('returns false for a string with spaces and content', () => {
    expect(isNullOrEmpty(' hello ')).toBe(false);
  });

  it('returns false for a single character string', () => {
    expect(isNullOrEmpty('a')).toBe(false);
  });

  it('returns false for a numeric string', () => {
    expect(isNullOrEmpty('0')).toBe(false);
  });
});

describe('isNullOrWhiteSpace', () => {
  it('returns true for null', () => {
    expect(isNullOrWhiteSpace(null)).toBe(true);
  });

  it('returns true for undefined', () => {
    expect(isNullOrWhiteSpace(undefined)).toBe(true);
  });

  it('returns true for empty string', () => {
    expect(isNullOrWhiteSpace('')).toBe(true);
  });

  it('returns true for a single space', () => {
    expect(isNullOrWhiteSpace(' ')).toBe(true);
  });

  it('returns true for multiple spaces', () => {
    expect(isNullOrWhiteSpace('   ')).toBe(true);
  });

  it('returns true for tabs and newlines', () => {
    expect(isNullOrWhiteSpace('  \t\n')).toBe(true);
  });

  it('returns false for a non-empty string', () => {
    expect(isNullOrWhiteSpace('hello')).toBe(false);
  });

  it('returns false for a string with leading/trailing whitespace but content', () => {
    expect(isNullOrWhiteSpace(' hello ')).toBe(false);
  });

  it('returns false for a numeric string', () => {
    expect(isNullOrWhiteSpace('0')).toBe(false);
  });

  it('returns true for tab-only string', () => {
    expect(isNullOrWhiteSpace('\t')).toBe(true);
  });
});

describe('isNotNullOrEmpty', () => {
  it('returns false for null', () => {
    expect(isNotNullOrEmpty(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isNotNullOrEmpty(undefined)).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isNotNullOrEmpty('')).toBe(false);
  });

  it('returns true for a non-empty string', () => {
    expect(isNotNullOrEmpty('hello')).toBe(true);
  });

  it('returns true for whitespace-only string', () => {
    expect(isNotNullOrEmpty(' ')).toBe(true);
  });

  it('returns true for a string with content', () => {
    expect(isNotNullOrEmpty('abc')).toBe(true);
  });

  it('returns true for a numeric string', () => {
    expect(isNotNullOrEmpty('0')).toBe(true);
  });

  it('returns true for tabs and newlines', () => {
    expect(isNotNullOrEmpty('\t\n')).toBe(true);
  });

  it('returns true for a string with leading/trailing spaces', () => {
    expect(isNotNullOrEmpty(' hello ')).toBe(true);
  });

  it('returns true for a single character', () => {
    expect(isNotNullOrEmpty('a')).toBe(true);
  });
});

describe('isNotNullOrWhiteSpace', () => {
  it('returns false for null', () => {
    expect(isNotNullOrWhiteSpace(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isNotNullOrWhiteSpace(undefined)).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isNotNullOrWhiteSpace('')).toBe(false);
  });

  it('returns false for a single space', () => {
    expect(isNotNullOrWhiteSpace(' ')).toBe(false);
  });

  it('returns false for multiple spaces', () => {
    expect(isNotNullOrWhiteSpace('   ')).toBe(false);
  });

  it('returns false for tabs and newlines', () => {
    expect(isNotNullOrWhiteSpace('  \t\n')).toBe(false);
  });

  it('returns true for a non-empty string', () => {
    expect(isNotNullOrWhiteSpace('hello')).toBe(true);
  });

  it('returns true for a string with leading/trailing whitespace but content', () => {
    expect(isNotNullOrWhiteSpace(' hello ')).toBe(true);
  });

  it('returns true for a numeric string', () => {
    expect(isNotNullOrWhiteSpace('0')).toBe(true);
  });

  it('returns true for a single character', () => {
    expect(isNotNullOrWhiteSpace('a')).toBe(true);
  });
});
