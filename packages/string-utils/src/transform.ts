export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

export function padLeft(str: string, totalLength: number, padChar: string = ' '): string {
  return str.padStart(totalLength, padChar);
}

export function padRight(str: string, totalLength: number, padChar: string = ' '): string {
  return str.padEnd(totalLength, padChar);
}

export function slugify(str: string, separator: string = '-'): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, separator)
    .replace(new RegExp(`^${escapeRegex(separator)}|${escapeRegex(separator)}$`, 'g'), '');
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function mask(str: string, showStart: number = 0, showEnd: number = 0, maskChar: string = '*'): string {
  if (str.length <= showStart + showEnd) return str;
  const start = str.slice(0, showStart);
  const end = showEnd > 0 ? str.slice(-showEnd) : '';
  const masked = maskChar.repeat(str.length - showStart - showEnd);
  return start + masked + end;
}

export function reverse(str: string): string {
  return [...str].reverse().join('');
}

export function countOccurrences(str: string, search: string): number {
  if (!search) return 0;
  let count = 0;
  let pos = 0;
  while ((pos = str.indexOf(search, pos)) !== -1) {
    count++;
    pos += search.length;
  }
  return count;
}
