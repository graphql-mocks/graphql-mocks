import { expect } from 'chai';
import expected from './introducing-paper.result';
import { result as actual } from './introducing-paper.source';

it('paper/introducing-paper-get', () => {
  const { title, actors, richard } = actual;
  expect(title).to.deep.equal(expected.title);
  expect(actors).to.deep.equal(expected.actors);
  expect(richard).to.deep.equal(expected.richard);
});
