import { buildSchema, GraphQLSchema } from 'graphql';
import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';
import { walk, WalkCallback } from '../../../src/utils/walk';
import { h, Highlight } from '../../../src/highlight/highlight';
import { Reference } from '../../../src/highlight/types';
import { field } from '../../../src/highlight/highlighter/field';

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

    highlight = h(graphqlSchema);
  });

  const getCallbackReferences = (spy: SinonSpy): Reference[] =>
    spy.getCalls().map((call) => (call.args as Parameters<WalkCallback>)[0].reference);

  describe('WalkSource.GRAPHQL_SCHEMA', function () {
    it('walks a graphql', async function () {
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

    it('filters down on include target', async function () {
      const callbackSpy = spy();
      await walk(graphqlSchema, highlight.filter(field(['Query', '*'])), callbackSpy);
      const references = getCallbackReferences(callbackSpy);

      expect(references).to.deep.equal([
        ['Query', 'person'],
        ['Query', 'locations'],
      ]);
    });
  });
});
