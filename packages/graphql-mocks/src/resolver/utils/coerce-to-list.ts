// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function coerceToList(subject: unknown): any[] {
  if (subject == null) {
    return [];
  }

  if (Array.isArray(subject)) {
    return subject;
  }

  return [subject];
}
