import { beforeEach } from 'mocha';
import { createSchema } from '../../../src/graphql/create-schema';
import { storeTypenamesFromSchema } from '../../../src/store/store-typenames-from-schema';
import { expect } from 'chai';
import { GraphQLSchema } from 'graphql';

describe('store-typenames-from-schema', () => {
  let schema: GraphQLSchema;

  beforeEach(() => {
    schema = createSchema(`
      schema {
        query: Query
        mutation: Mutation
      }

      type Query {
        hello: Hello
        string: String
      }

      type Mutation {
        add: Add
      }

      type Add {
        string: String 
      }

      type Hello {
        string: String
      }

      input SomeInput {
        string: String
      }

      type UnreferencedType {
        string: String
      }
    `);
  });

  it('returns non-root, non-input types, non-internal types from the schema', () => {
    expect(storeTypenamesFromSchema(schema)).to.deep.equal(['Add', 'Hello', 'UnreferencedType']);
  });
});
