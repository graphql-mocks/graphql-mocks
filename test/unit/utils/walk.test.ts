import { buildSchema, GraphQLSchema } from 'graphql';
import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';
import { walk, WalkCallback } from '../../../src/utils/walk';
import { h, Highlight } from '../../../src/highlight/highlight';
import { Reference } from '../../../src/highlight/types';
import { field } from '../../../src/highlight/highlighter/field';
import { resolvesTo } from '../../../src/highlight/highlighter/resolves-to';

function getCallbackReferences(spy: SinonSpy): Reference[] {
  return spy.getCalls().map((call) => (call.args as Parameters<WalkCallback>)[0].reference);
}

describe('utils/walk', function () {
  let graphqlSchema: GraphQLSchema;
  let highlight: Highlight;

  beforeEach(function () {
    graphqlSchema = buildSchema(`
      schema {
        query: Query
      }

      type Query {
        person: Person!
        locations: [Location!]!
      }

      type Pet {
        name: String!
      }

      type Location {
        city: String!
        street: String!
      }

      type Person {
        name: String!
        location: Location!
        pet: Pet!
      }
    `);

    highlight = h(graphqlSchema).include(resolvesTo());
  });

  it('walks references from a highlight', async function () {
    const callbackSpy = spy();
    await walk(graphqlSchema, highlight, callbackSpy);
    const references = getCallbackReferences(callbackSpy);

    expect(references.sort()).to.deep.equal(
      [
        ['Query', 'person'],
        ['Query', 'locations'],
        ['Person', 'name'],
        ['Person', 'location'],
        ['Person', 'pet'],
        ['Location', 'city'],
        ['Location', 'street'],
        ['Pet', 'name'],
      ].sort(),
    );
  });

  it('can walk references from a filtered highlight', async function () {
    const callbackSpy = spy();
    await walk(graphqlSchema, highlight.filter(field(['Query', '*'])), callbackSpy);
    const references = getCallbackReferences(callbackSpy);

    expect(references).to.deep.equal([
      ['Query', 'person'],
      ['Query', 'locations'],
    ]);
  });
});
