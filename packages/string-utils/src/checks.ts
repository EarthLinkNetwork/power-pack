export function isNullOrEmpty(str: string | null | undefined): str is null | undefined | '' {
  return str === null || str === undefined || str === '';
}

export function isNullOrWhiteSpace(str: string | null | undefined): boolean {
  return str === null || str === undefined || str.trim() === '';
}

export function isNotNullOrEmpty(str: string | null | undefined): str is string {
  return str !== null && str !== undefined && str !== '';
}

export function isNotNullOrWhiteSpace(str: string | null | undefined): str is string {
  return str !== null && str !== undefined && str.trim() !== '';
}
