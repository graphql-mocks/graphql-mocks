export function isEqual(a: Reference, b: Reference): boolean {
  return a === b || (Array.isArray(a) && Array.isArray(b) && a[0] === b[0] && a[1] === b[1]);
}
