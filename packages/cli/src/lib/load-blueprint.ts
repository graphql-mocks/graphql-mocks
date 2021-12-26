import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as Handlebars from 'handlebars';

export default function loadBlueprint(name: string) {
  const blueprintPath = resolve(__dirname, '../blueprints/', `${name}.hbs`);
  const contents = readFileSync(blueprintPath).toString();

  if (!contents) {
    throw new Error(`Could not load blueprint from ${blueprintPath}`);
  }

  const template = Handlebars.compile(contents);
  return template;
}
