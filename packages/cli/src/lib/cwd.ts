import process from 'process';
let mock: string | undefined;

export function setMockCwd(value: string): void {
  mock = value;
}

export function restoreCwd(): void {
  mock = undefined;
}

export default function cwd(): string {
  if (mock) {
    return mock;
  }

  return process.cwd();
}
