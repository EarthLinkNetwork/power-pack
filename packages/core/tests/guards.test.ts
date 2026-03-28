import {
  isString,
  isNumber,
  isBoolean,
  isArray,
  isObject,
  isFunction,
  isDefined,
  isNotNull,
  isPresent,
  assertType,
  assertDefined,
  assertNotNull,
  assertTrue,
  exhaustive,
} from '../src/guards';

describe('Guards', () => {
  describe('isString()', () => {
    it('returns true for "hello"', () => {
      expect(isString('hello')).toBe(true);
    });

    it('returns true for empty string', () => {
      expect(isString('')).toBe(true);
    });

    it('returns false for 123', () => {
      expect(isString(123)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isString(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isString(undefined)).toBe(false);
    });
  });

  describe('isNumber()', () => {
    it('returns true for 42', () => {
      expect(isNumber(42)).toBe(true);
    });

    it('returns true for 0', () => {
      expect(isNumber(0)).toBe(true);
    });

    it('returns true for -1', () => {
      expect(isNumber(-1)).toBe(true);
    });

    it('returns false for NaN', () => {
      expect(isNumber(NaN)).toBe(false);
    });

    it('returns false for a string', () => {
      expect(isNumber('string')).toBe(false);
    });

    it('returns false for null', () => {
      expect(isNumber(null)).toBe(false);
    });
  });

  describe('isBoolean()', () => {
    it('returns true for true', () => {
      expect(isBoolean(true)).toBe(true);
    });

    it('returns true for false', () => {
      expect(isBoolean(false)).toBe(true);
    });

    it('returns false for 0', () => {
      expect(isBoolean(0)).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isBoolean('')).toBe(false);
    });

    it('returns false for null', () => {
      expect(isBoolean(null)).toBe(false);
    });
  });

  describe('isArray()', () => {
    it('returns true for empty array', () => {
      expect(isArray([])).toBe(true);
    });

    it('returns true for [1, 2]', () => {
      expect(isArray([1, 2])).toBe(true);
    });

    it('returns false for object', () => {
      expect(isArray({})).toBe(false);
    });

    it('returns false for string', () => {
      expect(isArray('string')).toBe(false);
    });

    it('returns false for null', () => {
      expect(isArray(null)).toBe(false);
    });
  });

  describe('isObject()', () => {
    it('returns true for empty object', () => {
      expect(isObject({})).toBe(true);
    });

    it('returns true for { a: 1 }', () => {
      expect(isObject({ a: 1 })).toBe(true);
    });

    it('returns false for array', () => {
      expect(isObject([])).toBe(false);
    });

    it('returns false for null', () => {
      expect(isObject(null)).toBe(false);
    });

    it('returns false for string', () => {
      expect(isObject('string')).toBe(false);
    });

    it('returns true for new Date()', () => {
      expect(isObject(new Date())).toBe(true);
    });
  });

  describe('isFunction()', () => {
    it('returns true for arrow function', () => {
      expect(isFunction(() => {})).toBe(true);
    });

    it('returns true for function expression', () => {
      expect(isFunction(function () {})).toBe(true);
    });

    it('returns true for class', () => {
      expect(isFunction(class {})).toBe(true);
    });

    it('returns false for string', () => {
      expect(isFunction('string')).toBe(false);
    });

    it('returns false for object', () => {
      expect(isFunction({})).toBe(false);
    });

    it('returns false for null', () => {
      expect(isFunction(null)).toBe(false);
    });
  });

  describe('isDefined()', () => {
    it('returns true for a string value', () => {
      expect(isDefined('value')).toBe(true);
    });

    it('returns true for 0', () => {
      expect(isDefined(0)).toBe(true);
    });

    it('returns true for null', () => {
      expect(isDefined(null)).toBe(true);
    });

    it('returns false for undefined', () => {
      expect(isDefined(undefined)).toBe(false);
    });
  });

  describe('isNotNull()', () => {
    it('returns true for a string value', () => {
      expect(isNotNull('value')).toBe(true);
    });

    it('returns true for 0', () => {
      expect(isNotNull(0)).toBe(true);
    });

    it('returns true for undefined', () => {
      expect(isNotNull(undefined)).toBe(true);
    });

    it('returns false for null', () => {
      expect(isNotNull(null)).toBe(false);
    });
  });

  describe('isPresent()', () => {
    it('returns true for a string value', () => {
      expect(isPresent('value')).toBe(true);
    });

    it('returns true for 0', () => {
      expect(isPresent(0)).toBe(true);
    });

    it('returns false for null', () => {
      expect(isPresent(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isPresent(undefined)).toBe(false);
    });
  });

  describe('assertType()', () => {
    it('passes for a matching predicate', () => {
      expect(() => assertType('hello', isString)).not.toThrow();
    });

    it('throws TypeError for a non-matching predicate', () => {
      expect(() => assertType(123, isString)).toThrow(TypeError);
    });

    it('throws with default message', () => {
      expect(() => assertType(123, isString)).toThrow('Type assertion failed');
    });

    it('throws with custom message', () => {
      expect(() => assertType(123, isString, 'Expected a string')).toThrow('Expected a string');
    });
  });

  describe('assertDefined()', () => {
    it('passes for a defined value', () => {
      expect(() => assertDefined('value')).not.toThrow();
    });

    it('passes for 0', () => {
      expect(() => assertDefined(0)).not.toThrow();
    });

    it('passes for null', () => {
      expect(() => assertDefined(null)).not.toThrow();
    });

    it('throws TypeError for undefined', () => {
      expect(() => assertDefined(undefined)).toThrow(TypeError);
    });

    it('throws with default message', () => {
      expect(() => assertDefined(undefined)).toThrow('Expected value to be defined');
    });

    it('throws with custom message', () => {
      expect(() => assertDefined(undefined, 'Must be defined')).toThrow('Must be defined');
    });
  });

  describe('assertNotNull()', () => {
    it('passes for a non-null value', () => {
      expect(() => assertNotNull('value')).not.toThrow();
    });

    it('passes for 0', () => {
      expect(() => assertNotNull(0)).not.toThrow();
    });

    it('passes for undefined', () => {
      expect(() => assertNotNull(undefined)).not.toThrow();
    });

    it('throws TypeError for null', () => {
      expect(() => assertNotNull(null)).toThrow(TypeError);
    });

    it('throws with default message', () => {
      expect(() => assertNotNull(null)).toThrow('Expected value to be non-null');
    });

    it('throws with custom message', () => {
      expect(() => assertNotNull(null, 'Must not be null')).toThrow('Must not be null');
    });
  });

  describe('assertTrue()', () => {
    it('passes for true', () => {
      expect(() => assertTrue(true)).not.toThrow();
    });

    it('throws for false', () => {
      expect(() => assertTrue(false)).toThrow(Error);
    });

    it('throws with default message', () => {
      expect(() => assertTrue(false)).toThrow('Assertion failed');
    });

    it('throws with custom message', () => {
      expect(() => assertTrue(false, 'Custom assertion message')).toThrow('Custom assertion message');
    });
  });

  describe('exhaustive()', () => {
    it('always throws with the unexpected value', () => {
      expect(() => exhaustive('unexpected' as never)).toThrow('Unexpected value: unexpected');
    });

    it('throws an Error instance', () => {
      expect(() => exhaustive('unexpected' as never)).toThrow(Error);
    });
  });
});
