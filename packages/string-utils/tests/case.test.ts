import {
  toUpperCase,
  toLowerCase,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toTitleCase,
  toConstantCase,
} from '../src';

describe('toUpperCase', () => {
  it('converts a lowercase string to uppercase', () => {
    expect(toUpperCase('hello')).toBe('HELLO');
  });

  it('returns an already uppercase string unchanged', () => {
    expect(toUpperCase('HELLO')).toBe('HELLO');
  });

  it('converts a mixed-case string to uppercase', () => {
    expect(toUpperCase('Hello World')).toBe('HELLO WORLD');
  });

  it('returns an empty string for empty input', () => {
    expect(toUpperCase('')).toBe('');
  });

  it('handles strings with numbers and special characters', () => {
    expect(toUpperCase('abc123!@#')).toBe('ABC123!@#');
  });

  it('handles unicode characters', () => {
    expect(toUpperCase('cafe')).toBe('CAFE');
  });

  it('handles single character', () => {
    expect(toUpperCase('a')).toBe('A');
  });

  it('handles whitespace-only string', () => {
    expect(toUpperCase('   ')).toBe('   ');
  });
});

describe('toLowerCase', () => {
  it('converts an uppercase string to lowercase', () => {
    expect(toLowerCase('HELLO')).toBe('hello');
  });

  it('returns an already lowercase string unchanged', () => {
    expect(toLowerCase('hello')).toBe('hello');
  });

  it('converts a mixed-case string to lowercase', () => {
    expect(toLowerCase('Hello World')).toBe('hello world');
  });

  it('returns an empty string for empty input', () => {
    expect(toLowerCase('')).toBe('');
  });

  it('handles strings with numbers and special characters', () => {
    expect(toLowerCase('ABC123!@#')).toBe('abc123!@#');
  });

  it('handles single character', () => {
    expect(toLowerCase('A')).toBe('a');
  });

  it('handles whitespace-only string', () => {
    expect(toLowerCase('   ')).toBe('   ');
  });

  it('handles mixed content', () => {
    expect(toLowerCase('HeLLo WoRLD 123')).toBe('hello world 123');
  });
});

describe('toCamelCase', () => {
  it('converts from snake_case', () => {
    expect(toCamelCase('hello_world')).toBe('helloWorld');
  });

  it('converts from kebab-case', () => {
    expect(toCamelCase('hello-world')).toBe('helloWorld');
  });

  it('converts from PascalCase', () => {
    expect(toCamelCase('HelloWorld')).toBe('helloWorld');
  });

  it('converts from space-separated words', () => {
    expect(toCamelCase('hello world')).toBe('helloWorld');
  });

  it('returns empty string for empty input', () => {
    expect(toCamelCase('')).toBe('');
  });

  it('handles a single word', () => {
    expect(toCamelCase('hello')).toBe('hello');
  });

  it('handles multiple words with mixed separators', () => {
    expect(toCamelCase('foo_bar-baz qux')).toBe('fooBarBazQux');
  });

  it('handles an uppercase single word', () => {
    expect(toCamelCase('HELLO')).toBe('hello');
  });

  it('handles CONSTANT_CASE', () => {
    expect(toCamelCase('HELLO_WORLD')).toBe('helloWorld');
  });

  it('handles three words from snake_case', () => {
    expect(toCamelCase('one_two_three')).toBe('oneTwoThree');
  });
});

describe('toPascalCase', () => {
  it('converts from snake_case', () => {
    expect(toPascalCase('hello_world')).toBe('HelloWorld');
  });

  it('converts from kebab-case', () => {
    expect(toPascalCase('hello-world')).toBe('HelloWorld');
  });

  it('converts from camelCase', () => {
    expect(toPascalCase('helloWorld')).toBe('HelloWorld');
  });

  it('converts from space-separated words', () => {
    expect(toPascalCase('hello world')).toBe('HelloWorld');
  });

  it('returns empty string for empty input', () => {
    expect(toPascalCase('')).toBe('');
  });

  it('handles a single word', () => {
    expect(toPascalCase('hello')).toBe('Hello');
  });

  it('handles CONSTANT_CASE', () => {
    expect(toPascalCase('HELLO_WORLD')).toBe('HelloWorld');
  });

  it('handles already PascalCase', () => {
    expect(toPascalCase('HelloWorld')).toBe('HelloWorld');
  });

  it('handles multiple words with mixed separators', () => {
    expect(toPascalCase('foo_bar-baz qux')).toBe('FooBarBazQux');
  });

  it('handles single character', () => {
    expect(toPascalCase('a')).toBe('A');
  });
});

describe('toSnakeCase', () => {
  it('converts from camelCase', () => {
    expect(toSnakeCase('helloWorld')).toBe('hello_world');
  });

  it('converts from PascalCase', () => {
    expect(toSnakeCase('HelloWorld')).toBe('hello_world');
  });

  it('converts from kebab-case', () => {
    expect(toSnakeCase('hello-world')).toBe('hello_world');
  });

  it('converts from space-separated words', () => {
    expect(toSnakeCase('hello world')).toBe('hello_world');
  });

  it('returns empty string for empty input', () => {
    expect(toSnakeCase('')).toBe('');
  });

  it('handles a single word', () => {
    expect(toSnakeCase('hello')).toBe('hello');
  });

  it('handles CONSTANT_CASE', () => {
    expect(toSnakeCase('HELLO_WORLD')).toBe('hello_world');
  });

  it('handles mixed separators', () => {
    expect(toSnakeCase('foo_bar-baz qux')).toBe('foo_bar_baz_qux');
  });

  it('handles three camelCase words', () => {
    expect(toSnakeCase('oneTwoThree')).toBe('one_two_three');
  });

  it('handles already snake_case', () => {
    expect(toSnakeCase('hello_world')).toBe('hello_world');
  });
});

describe('toKebabCase', () => {
  it('converts from camelCase', () => {
    expect(toKebabCase('helloWorld')).toBe('hello-world');
  });

  it('converts from PascalCase', () => {
    expect(toKebabCase('HelloWorld')).toBe('hello-world');
  });

  it('converts from snake_case', () => {
    expect(toKebabCase('hello_world')).toBe('hello-world');
  });

  it('converts from space-separated words', () => {
    expect(toKebabCase('hello world')).toBe('hello-world');
  });

  it('returns empty string for empty input', () => {
    expect(toKebabCase('')).toBe('');
  });

  it('handles a single word', () => {
    expect(toKebabCase('hello')).toBe('hello');
  });

  it('handles CONSTANT_CASE', () => {
    expect(toKebabCase('HELLO_WORLD')).toBe('hello-world');
  });

  it('handles mixed separators', () => {
    expect(toKebabCase('foo_bar-baz qux')).toBe('foo-bar-baz-qux');
  });

  it('handles already kebab-case', () => {
    expect(toKebabCase('hello-world')).toBe('hello-world');
  });

  it('handles three camelCase words', () => {
    expect(toKebabCase('oneTwoThree')).toBe('one-two-three');
  });
});

describe('toTitleCase', () => {
  it('converts from camelCase', () => {
    expect(toTitleCase('helloWorld')).toBe('Hello World');
  });

  it('converts from snake_case', () => {
    expect(toTitleCase('hello_world')).toBe('Hello World');
  });

  it('converts from kebab-case', () => {
    expect(toTitleCase('hello-world')).toBe('Hello World');
  });

  it('converts from space-separated lowercase words', () => {
    expect(toTitleCase('hello world')).toBe('Hello World');
  });

  it('returns empty string for empty input', () => {
    expect(toTitleCase('')).toBe('');
  });

  it('handles a single word', () => {
    expect(toTitleCase('hello')).toBe('Hello');
  });

  it('handles CONSTANT_CASE', () => {
    expect(toTitleCase('HELLO_WORLD')).toBe('Hello World');
  });

  it('handles PascalCase', () => {
    expect(toTitleCase('HelloWorld')).toBe('Hello World');
  });

  it('handles three words', () => {
    expect(toTitleCase('one_two_three')).toBe('One Two Three');
  });

  it('handles single character', () => {
    expect(toTitleCase('a')).toBe('A');
  });
});

describe('toConstantCase', () => {
  it('converts from camelCase', () => {
    expect(toConstantCase('helloWorld')).toBe('HELLO_WORLD');
  });

  it('converts from kebab-case', () => {
    expect(toConstantCase('hello-world')).toBe('HELLO_WORLD');
  });

  it('converts from space-separated words', () => {
    expect(toConstantCase('hello world')).toBe('HELLO_WORLD');
  });

  it('converts from snake_case', () => {
    expect(toConstantCase('hello_world')).toBe('HELLO_WORLD');
  });

  it('returns empty string for empty input', () => {
    expect(toConstantCase('')).toBe('');
  });

  it('handles a single word', () => {
    expect(toConstantCase('hello')).toBe('HELLO');
  });

  it('handles PascalCase', () => {
    expect(toConstantCase('HelloWorld')).toBe('HELLO_WORLD');
  });

  it('handles already CONSTANT_CASE', () => {
    expect(toConstantCase('HELLO_WORLD')).toBe('HELLO_WORLD');
  });

  it('handles three words', () => {
    expect(toConstantCase('one two three')).toBe('ONE_TWO_THREE');
  });

  it('handles mixed separators', () => {
    expect(toConstantCase('foo_bar-baz qux')).toBe('FOO_BAR_BAZ_QUX');
  });
});
