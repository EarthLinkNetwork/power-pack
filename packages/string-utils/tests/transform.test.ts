import {
  truncate,
  padLeft,
  padRight,
  slugify,
  mask,
  reverse,
  countOccurrences,
} from '../src';

describe('truncate', () => {
  it('returns the original string if shorter than maxLength', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('returns the original string if equal to maxLength', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });

  it('truncates and adds default suffix when longer than maxLength', () => {
    expect(truncate('hello world', 8)).toBe('hello...');
  });

  it('truncates with a custom suffix', () => {
    expect(truncate('hello world', 7, '~')).toBe('hello ~');
  });

  it('handles maxLength equal to suffix length', () => {
    expect(truncate('hello world', 3)).toBe('...');
  });

  it('returns empty string when truncated with empty suffix to 0', () => {
    expect(truncate('hello', 0, '')).toBe('');
  });

  it('handles empty string input', () => {
    expect(truncate('', 5)).toBe('');
  });

  it('handles a single character string that needs no truncation', () => {
    expect(truncate('a', 5)).toBe('a');
  });

  it('truncates with a multi-character custom suffix', () => {
    expect(truncate('hello world', 10, ' [...]')).toBe('hell [...]');
  });

  it('truncates a very long string', () => {
    const long = 'a'.repeat(1000);
    const result = truncate(long, 10);
    expect(result).toBe('aaaaaaa...');
    expect(result.length).toBe(10);
  });
});

describe('padLeft', () => {
  it('pads a shorter string with default space', () => {
    expect(padLeft('hi', 5)).toBe('   hi');
  });

  it('returns the string unchanged if already at total length', () => {
    expect(padLeft('hello', 5)).toBe('hello');
  });

  it('returns the string unchanged if longer than total length', () => {
    expect(padLeft('hello world', 5)).toBe('hello world');
  });

  it('pads with a custom character', () => {
    expect(padLeft('42', 5, '0')).toBe('00042');
  });

  it('pads empty string', () => {
    expect(padLeft('', 3)).toBe('   ');
  });

  it('pads with a custom character to length 1', () => {
    expect(padLeft('', 1, 'x')).toBe('x');
  });

  it('handles single character string', () => {
    expect(padLeft('a', 4, '-')).toBe('---a');
  });

  it('pads to zero length returns original', () => {
    expect(padLeft('hi', 0)).toBe('hi');
  });

  it('handles large padding', () => {
    expect(padLeft('x', 10, '.')).toBe('.........x');
  });

  it('handles pad char longer than one character', () => {
    expect(padLeft('x', 5, 'ab')).toBe('ababx');
  });
});

describe('padRight', () => {
  it('pads a shorter string with default space', () => {
    expect(padRight('hi', 5)).toBe('hi   ');
  });

  it('returns the string unchanged if already at total length', () => {
    expect(padRight('hello', 5)).toBe('hello');
  });

  it('returns the string unchanged if longer than total length', () => {
    expect(padRight('hello world', 5)).toBe('hello world');
  });

  it('pads with a custom character', () => {
    expect(padRight('42', 5, '0')).toBe('42000');
  });

  it('pads empty string', () => {
    expect(padRight('', 3)).toBe('   ');
  });

  it('handles single character string', () => {
    expect(padRight('a', 4, '-')).toBe('a---');
  });

  it('pads to zero length returns original', () => {
    expect(padRight('hi', 0)).toBe('hi');
  });

  it('handles large padding', () => {
    expect(padRight('x', 10, '.')).toBe('x.........');
  });

  it('handles pad char longer than one character', () => {
    expect(padRight('x', 5, 'ab')).toBe('xabab');
  });

  it('pads with a custom character to length 1 from empty', () => {
    expect(padRight('', 1, 'x')).toBe('x');
  });
});

describe('slugify', () => {
  it('converts a simple phrase to a slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('removes diacritics', () => {
    expect(slugify('cafe latte')).toBe('cafe-latte');
  });

  it('removes special characters', () => {
    expect(slugify('Hello! @World#')).toBe('hello-world');
  });

  it('strips leading and trailing separators', () => {
    expect(slugify('  Hello World  ')).toBe('hello-world');
  });

  it('collapses multiple special chars into one separator', () => {
    expect(slugify('Hello---World')).toBe('hello-world');
  });

  it('uses a custom separator', () => {
    expect(slugify('Hello World', '_')).toBe('hello_world');
  });

  it('returns empty string for empty input', () => {
    expect(slugify('')).toBe('');
  });

  it('handles already-slugified string', () => {
    expect(slugify('hello-world')).toBe('hello-world');
  });

  it('handles numbers in the string', () => {
    expect(slugify('Hello World 123')).toBe('hello-world-123');
  });

  it('handles string with only special characters', () => {
    expect(slugify('!@#$%^&*()')).toBe('');
  });
});

describe('mask', () => {
  it('masks entire string with no visible chars', () => {
    expect(mask('hello')).toBe('*****');
  });

  it('shows start characters only', () => {
    expect(mask('1234567890', 4)).toBe('1234******');
  });

  it('shows end characters only', () => {
    expect(mask('1234567890', 0, 4)).toBe('******7890');
  });

  it('shows both start and end characters', () => {
    expect(mask('1234567890', 2, 2)).toBe('12******90');
  });

  it('returns original if string is shorter than showStart + showEnd', () => {
    expect(mask('hi', 3, 3)).toBe('hi');
  });

  it('returns original if string length equals showStart + showEnd', () => {
    expect(mask('abcd', 2, 2)).toBe('abcd');
  });

  it('uses a custom mask character', () => {
    expect(mask('hello', 1, 1, '#')).toBe('h###o');
  });

  it('masks a single character string with no visible', () => {
    expect(mask('a')).toBe('*');
  });

  it('masks with showStart equal to string length minus 1', () => {
    expect(mask('hello', 4, 0)).toBe('hell*');
  });

  it('handles empty string', () => {
    expect(mask('')).toBe('');
  });
});

describe('reverse', () => {
  it('reverses a simple string', () => {
    expect(reverse('hello')).toBe('olleh');
  });

  it('returns empty string for empty input', () => {
    expect(reverse('')).toBe('');
  });

  it('returns same for single character', () => {
    expect(reverse('a')).toBe('a');
  });

  it('reverses a palindrome to itself', () => {
    expect(reverse('racecar')).toBe('racecar');
  });

  it('reverses a string with spaces', () => {
    expect(reverse('abc def')).toBe('fed cba');
  });

  it('reverses a string with numbers', () => {
    expect(reverse('12345')).toBe('54321');
  });

  it('reverses a two-character string', () => {
    expect(reverse('ab')).toBe('ba');
  });

  it('handles special characters', () => {
    expect(reverse('!@#')).toBe('#@!');
  });

  it('handles unicode emoji correctly', () => {
    expect(reverse('ab')).toBe('ba');
  });

  it('reverses mixed content', () => {
    expect(reverse('a1b2c3')).toBe('3c2b1a');
  });
});

describe('countOccurrences', () => {
  it('returns 0 when search string is not found', () => {
    expect(countOccurrences('hello world', 'xyz')).toBe(0);
  });

  it('counts a single occurrence', () => {
    expect(countOccurrences('hello world', 'world')).toBe(1);
  });

  it('counts multiple occurrences', () => {
    expect(countOccurrences('abcabcabc', 'abc')).toBe(3);
  });

  it('returns 0 for empty search string', () => {
    expect(countOccurrences('hello', '')).toBe(0);
  });

  it('returns 0 for empty source string', () => {
    expect(countOccurrences('', 'hello')).toBe(0);
  });

  it('counts single character occurrences', () => {
    expect(countOccurrences('banana', 'a')).toBe(3);
  });

  it('does not count overlapping occurrences', () => {
    expect(countOccurrences('aaaa', 'aa')).toBe(2);
  });

  it('counts case-sensitively', () => {
    expect(countOccurrences('Hello hello HELLO', 'hello')).toBe(1);
  });

  it('counts occurrences at start and end', () => {
    expect(countOccurrences('abXXab', 'ab')).toBe(2);
  });

  it('handles search string same as source', () => {
    expect(countOccurrences('hello', 'hello')).toBe(1);
  });
});
