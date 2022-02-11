import chalk from 'chalk';

export function errors(errors: Error[]): string {
  return errors?.map((error) => ` * ${chalk.yellow(error.message)}`).join('\n');
}
