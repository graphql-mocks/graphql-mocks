export function filter(source: Reference[], update: Reference[]): Reference[] {
  return source.filter((reference) => {
    return Boolean(update.find((updateRef) => equal(updateRef, reference)));
  });
}
