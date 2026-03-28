import {
  some,
  none,
  isSome,
  isNone,
  fromNullable,
  mapOption,
  unwrapOption,
  unwrapOptionOr,
  Option,
} from '../src/option';

describe('Option', () => {
  describe('some()', () => {
    it('creates a Some type with the given value', () => {
      const option = some(42);
      expect(option).toEqual({ some: true, value: 42 });
    });

    it('creates a Some type with a string value', () => {
      const option = some('hello');
      expect(option).toEqual({ some: true, value: 'hello' });
    });

    it('creates a Some type with a complex object', () => {
      const obj = { name: 'test' };
      const option = some(obj);
      expect(option).toEqual({ some: true, value: obj });
    });
  });

  describe('none()', () => {
    it('creates a None type', () => {
      const option = none();
      expect(option).toEqual({ some: false });
    });

    it('does not have a value property', () => {
      const option = none();
      expect('value' in option).toBe(false);
    });
  });

  describe('isSome()', () => {
    it('returns true for Some', () => {
      expect(isSome(some(1))).toBe(true);
    });

    it('returns false for None', () => {
      expect(isSome(none())).toBe(false);
    });
  });

  describe('isNone()', () => {
    it('returns true for None', () => {
      expect(isNone(none())).toBe(true);
    });

    it('returns false for Some', () => {
      expect(isNone(some(1))).toBe(false);
    });
  });

  describe('fromNullable()', () => {
    it('returns None for null', () => {
      const option = fromNullable(null);
      expect(isNone(option)).toBe(true);
    });

    it('returns None for undefined', () => {
      const option = fromNullable(undefined);
      expect(isNone(option)).toBe(true);
    });

    it('returns Some(0) for 0', () => {
      const option = fromNullable(0);
      expect(isSome(option)).toBe(true);
      if (isSome(option)) {
        expect(option.value).toBe(0);
      }
    });

    it("returns Some('') for empty string", () => {
      const option = fromNullable('');
      expect(isSome(option)).toBe(true);
      if (isSome(option)) {
        expect(option.value).toBe('');
      }
    });

    it('returns Some(false) for false', () => {
      const option = fromNullable(false);
      expect(isSome(option)).toBe(true);
      if (isSome(option)) {
        expect(option.value).toBe(false);
      }
    });

    it('returns Some for a valid value', () => {
      const option = fromNullable('hello');
      expect(isSome(option)).toBe(true);
      if (isSome(option)) {
        expect(option.value).toBe('hello');
      }
    });

    it('returns Some for an object value', () => {
      const obj = { key: 'value' };
      const option = fromNullable(obj);
      expect(isSome(option)).toBe(true);
      if (isSome(option)) {
        expect(option.value).toBe(obj);
      }
    });
  });

  describe('mapOption()', () => {
    it('transforms the value for Some', () => {
      const option = mapOption(some(5), (x) => x * 2);
      expect(option).toEqual(some(10));
    });

    it('transforms Some value to a different type', () => {
      const option = mapOption(some(42), (x) => String(x));
      expect(option).toEqual(some('42'));
    });

    it('passes through None without calling the function', () => {
      const fn = jest.fn();
      const option = mapOption(none(), fn);
      expect(isNone(option)).toBe(true);
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe('unwrapOption()', () => {
    it('returns the value for Some', () => {
      expect(unwrapOption(some(42))).toBe(42);
    });

    it('returns complex value for Some', () => {
      const obj = { a: 1 };
      expect(unwrapOption(some(obj))).toBe(obj);
    });

    it('throws for None with the correct error message', () => {
      expect(() => unwrapOption(none())).toThrow('Called unwrapOption on a None value');
    });

    it('throws an Error instance for None', () => {
      expect(() => unwrapOption(none())).toThrow(Error);
    });
  });

  describe('unwrapOptionOr()', () => {
    it('returns the value for Some', () => {
      expect(unwrapOptionOr(some(42), 0)).toBe(42);
    });

    it('returns the default value for None', () => {
      expect(unwrapOptionOr(none() as Option<number>, 0)).toBe(0);
    });

    it('returns the default value with string type', () => {
      expect(unwrapOptionOr(none() as Option<string>, 'default')).toBe('default');
    });

    it('returns Some value even when default is provided', () => {
      expect(unwrapOptionOr(some('actual'), 'default')).toBe('actual');
    });
  });
});
