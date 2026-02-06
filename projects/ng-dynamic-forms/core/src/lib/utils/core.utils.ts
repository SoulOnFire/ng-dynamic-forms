export function isBoolean(value: any): value is boolean {
    return typeof value === 'boolean';
}

// tslint:disable-next-line:ban-types
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isFunction(value: any): value is Function {
    return typeof value === 'function';
}

export function isNumber(value: any): value is number {
    return typeof value === 'number';
}

export function isObject(value: any): value is object {
    return typeof value === 'object' && value !== null;
}

export function isString(value: any): value is string {
    return typeof value === 'string';
}

export function tryParseRegExpLiteral(input: string | RegExp): RegExp | null {
  try {
    if (input instanceof RegExp) return input;
    if (typeof input !== 'string' || input[0] !== '/') return null;

    const lastSlash = input.lastIndexOf('/');
    if (lastSlash <= 0) return null;

    const pattern = input.slice(1, lastSlash);
    const flags = input.slice(lastSlash + 1);

    return new RegExp(pattern, flags);
  } catch {
    return null;
  }
}
