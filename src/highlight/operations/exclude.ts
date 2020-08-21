export function exclude(source: Reference[], update: Reference[]): Reference[] {
  return differenceWith(source, update, equal);
}
