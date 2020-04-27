import { expect } from 'chai';
import { eachType } from '../../../src/resolver-map/each-type';
import { buildSchema, GraphQLSchema } from 'graphql';
import sinon from 'sinon';
import { generatePackOptions } from '../../mocks';

describe('resolver-map/each-type', function () {
  let schema: GraphQLSchema;

  beforeEach(() => {
    schema = buildSchema(`
      schema {
        query: Query
        mutation: Mutation,
      }

      type Query {
        hello: String
        spells: [Spell!]!
      }

      type Mutation {
        addSpell(spell: Spell!): Spell
      }

      type Spell {
        incantation: String
        isEvil: Boolean
      }
    `);
  });

  it('reduces a set of resolvers', function () {
    const withTypeSpy = sinon.spy();
    const resolverMap = {};

    eachType({
      withType: withTypeSpy,
    })(resolverMap, generatePackOptions({ dependencies: { graphqlSchema: schema } }));

    const typesCalled = withTypeSpy.getCalls().map((call) => call.args[0].type.name);

    expect(typesCalled).to.contain('Query');
    expect(typesCalled).to.contain('Mutation');
    expect(typesCalled).to.contain('Spell');
  });
});
