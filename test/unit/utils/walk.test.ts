import { buildSchema, GraphQLSchema, GraphQLObjectType } from 'graphql';
import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';
import { walk, WalkCallback } from '../../../src/utils/walk';
import { hi, Highlight, resolvesTo } from '../../../src/highlight';
import { Reference } from '../../../src/highlight/types';

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

    highlight = hi(graphqlSchema).include(resolvesTo());
  });

  it('walks references from a highlight', async function () {
    const queryType = graphqlSchema.getType('Query');
    const callbackSpy = spy();
    await walk(graphqlSchema, highlight.references, callbackSpy);
    const references = getCallbackReferences(callbackSpy);

    const callbackOptionsCallArgs = (callbackSpy.firstCall.args as Parameters<WalkCallback>)[0];
    expect(callbackOptionsCallArgs.type).to.equal(queryType);
    expect(callbackOptionsCallArgs.field).to.equal((queryType as GraphQLObjectType).getFields()?.person);

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
});
