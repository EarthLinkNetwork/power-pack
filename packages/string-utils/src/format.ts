/**
 * C#-style positional string formatting.
 * format("Hello {0}, you are {1}", "World", 42) => "Hello World, you are 42"
 */
export function format(template: string, ...args: unknown[]): string {
  return template.replace(/\{(\d+)\}/g, (match, index) => {
    const i = parseInt(index, 10);
    return i < args.length ? String(args[i]) : match;
  });
}

/**
 * Named placeholder formatting.
 * formatNamed("Hello {name}", { name: "World" }) => "Hello World"
 */
export function formatNamed(template: string, values: Record<string, unknown>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return key in values ? String(values[key]) : match;
  });
}

/**
 * Creates a reusable template function.
 * const greet = template("Hello {name}");
 * greet({ name: "World" }) => "Hello World"
 */
export function template(str: string): (values: Record<string, unknown>) => string {
  return (values: Record<string, unknown>) => formatNamed(str, values);
}
