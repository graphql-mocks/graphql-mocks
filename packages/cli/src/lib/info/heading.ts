import chalk from 'chalk';

export function heading(str: string): string {
  const underline = '-'.repeat(str.length);
  return chalk.bold(chalk.blueBright(`${str}\n${underline}`));
}
