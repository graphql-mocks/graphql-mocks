export function include(source: Reference[], update: Reference[]): Reference[] {
  return [...source, ...update];
}
