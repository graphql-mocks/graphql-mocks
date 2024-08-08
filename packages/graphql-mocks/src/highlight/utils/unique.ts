import { Reference } from '../types';

export function unique(fieldReferences: Reference[]): Reference[] {
  const stringified = fieldReferences.map((reference): string => {
    return Array.isArray(reference) ? `!!!${reference[0]}:::${reference[1]}` : reference;
  });

  const uniques: Reference[] = [];
  // automatically dedupe strings using a `Set`
  new Set(stringified).forEach((string) => {
    const reference =
      string[0] + string[1] + string[2] === '!!!'
        ? (string.replace('!!!', '').split(':::') as [string, string])
        : string;

    uniques.push(reference);
  });

  return uniques;
}
