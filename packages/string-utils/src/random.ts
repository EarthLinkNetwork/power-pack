import { randomBytes } from 'node:crypto';

const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

export function createRandomString(length: number): string {
  if (length <= 0) return '';
  const bytes = randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CHARS[bytes[i] % CHARS.length];
  }
  return result;
}
