export type Some<T> = { readonly some: true; readonly value: T };
export type None = { readonly some: false };
export type Option<T> = Some<T> | None;

export function some<T>(value: T): Some<T> {
  return { some: true, value };
}

export function none(): None {
  return { some: false };
}

export function isSome<T>(option: Option<T>): option is Some<T> {
  return option.some === true;
}

export function isNone<T>(option: Option<T>): option is None {
  return option.some === false;
}

export function fromNullable<T>(value: T | null | undefined): Option<T> {
  if (value === null || value === undefined) {
    return none();
  }
  return some(value);
}

export function mapOption<T, U>(option: Option<T>, fn: (value: T) => U): Option<U> {
  if (isSome(option)) {
    return some(fn(option.value));
  }
  return option;
}

export function unwrapOption<T>(option: Option<T>): T {
  if (isSome(option)) {
    return option.value;
  }
  throw new Error('Called unwrapOption on a None value');
}

export function unwrapOptionOr<T>(option: Option<T>, defaultValue: T): T {
  if (isSome(option)) {
    return option.value;
  }
  return defaultValue;
}
