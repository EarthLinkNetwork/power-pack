/**
 * Splits a string into words by detecting boundaries:
 * spaces, hyphens, underscores, and camelCase transitions.
 */
function splitWords(str: string): string[] {
  if (!str) return [];
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[\s\-_]+/)
    .filter(Boolean);
}

export function toUpperCase(str: string): string {
  return str.toUpperCase();
}

export function toLowerCase(str: string): string {
  return str.toLowerCase();
}

export function toCamelCase(str: string): string {
  const words = splitWords(str);
  if (words.length === 0) return '';
  return words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}

export function toPascalCase(str: string): string {
  const words = splitWords(str);
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}

export function toSnakeCase(str: string): string {
  return splitWords(str).map(w => w.toLowerCase()).join('_');
}

export function toKebabCase(str: string): string {
  return splitWords(str).map(w => w.toLowerCase()).join('-');
}

export function toTitleCase(str: string): string {
  return splitWords(str).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

export function toConstantCase(str: string): string {
  return splitWords(str).map(w => w.toUpperCase()).join('_');
}
