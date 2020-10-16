// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function coerceSingular(subject: unknown): any {
  if (!Array.isArray(subject)) {
    return subject;
  }

  if (subject.length === 1) {
    return subject[0];
  }

  if (subject.length === 0) {
    return null;
  }

  return subject;
}
