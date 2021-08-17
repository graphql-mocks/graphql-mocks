import { expect } from 'chai';
import expected from './introducing-paper.result';

it('paper/introducing-paper-get', async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const example = require('./introducing-paper.source');
  await example.run();

  const { title, actors, richard } = example.actual;
  expect(title).to.deep.equal(expected.title);
  expect(actors).to.deep.equal(expected.actors);
  expect(richard).to.deep.equal(expected.richard);
});
