import { format, formatNamed, template } from '../src';

describe('format', () => {
  it('returns template unchanged when no placeholders', () => {
    expect(format('Hello World')).toBe('Hello World');
  });

  it('replaces a single positional placeholder', () => {
    expect(format('Hello {0}', 'World')).toBe('Hello World');
  });

  it('replaces multiple positional placeholders', () => {
    expect(format('{0} is {1} years old', 'Alice', 30)).toBe('Alice is 30 years old');
  });

  it('replaces the same placeholder used multiple times', () => {
    expect(format('{0} and {0}', 'echo')).toBe('echo and echo');
  });

  it('leaves unmatched placeholders as-is when args are missing', () => {
    expect(format('Hello {0} and {1}', 'World')).toBe('Hello World and {1}');
  });

  it('ignores extra args', () => {
    expect(format('Hello {0}', 'World', 'Extra')).toBe('Hello World');
  });

  it('handles placeholders at start and end', () => {
    expect(format('{0}middle{1}', 'start', 'end')).toBe('startmiddleend');
  });

  it('replaces with numbers', () => {
    expect(format('Value: {0}', 42)).toBe('Value: 42');
  });

  it('replaces with boolean values', () => {
    expect(format('Is active: {0}', true)).toBe('Is active: true');
  });

  it('handles empty template', () => {
    expect(format('', 'arg')).toBe('');
  });

  it('replaces with null and undefined values', () => {
    expect(format('{0} and {1}', null, undefined)).toBe('null and undefined');
  });
});

describe('formatNamed', () => {
  it('replaces a single named placeholder', () => {
    expect(formatNamed('Hello {name}', { name: 'World' })).toBe('Hello World');
  });

  it('replaces multiple named placeholders', () => {
    expect(
      formatNamed('{name} is {age} years old', { name: 'Alice', age: 30 })
    ).toBe('Alice is 30 years old');
  });

  it('leaves unmatched placeholders as-is when key is missing', () => {
    expect(formatNamed('Hello {name} and {title}', { name: 'World' })).toBe(
      'Hello World and {title}'
    );
  });

  it('ignores extra keys in values', () => {
    expect(formatNamed('Hello {name}', { name: 'World', extra: 'ignored' })).toBe(
      'Hello World'
    );
  });

  it('replaces same placeholder used multiple times', () => {
    expect(formatNamed('{x} + {x} = {result}', { x: 2, result: 4 })).toBe(
      '2 + 2 = 4'
    );
  });

  it('handles empty template', () => {
    expect(formatNamed('', { name: 'World' })).toBe('');
  });

  it('handles empty values object', () => {
    expect(formatNamed('Hello {name}', {})).toBe('Hello {name}');
  });

  it('handles no placeholders in template', () => {
    expect(formatNamed('Hello World', { name: 'unused' })).toBe('Hello World');
  });

  it('replaces with numeric values', () => {
    expect(formatNamed('Count: {count}', { count: 0 })).toBe('Count: 0');
  });

  it('replaces with boolean values', () => {
    expect(formatNamed('Active: {active}', { active: false })).toBe('Active: false');
  });
});

describe('template', () => {
  it('creates a reusable template function', () => {
    const greet = template('Hello {name}');
    expect(greet({ name: 'World' })).toBe('Hello World');
  });

  it('can be called multiple times with different values', () => {
    const greet = template('Hello {name}');
    expect(greet({ name: 'Alice' })).toBe('Hello Alice');
    expect(greet({ name: 'Bob' })).toBe('Hello Bob');
  });

  it('handles multiple placeholders', () => {
    const tmpl = template('{greeting}, {name}!');
    expect(tmpl({ greeting: 'Hi', name: 'World' })).toBe('Hi, World!');
  });

  it('leaves unmatched placeholders as-is', () => {
    const tmpl = template('Hello {name} from {city}');
    expect(tmpl({ name: 'Alice' })).toBe('Hello Alice from {city}');
  });

  it('handles empty template', () => {
    const tmpl = template('');
    expect(tmpl({ name: 'World' })).toBe('');
  });

  it('handles template with no placeholders', () => {
    const tmpl = template('Static text');
    expect(tmpl({ key: 'value' })).toBe('Static text');
  });

  it('handles empty values object', () => {
    const tmpl = template('Hello {name}');
    expect(tmpl({})).toBe('Hello {name}');
  });

  it('returns a function', () => {
    const tmpl = template('test');
    expect(typeof tmpl).toBe('function');
  });
});
