import { buildSchema, GraphQLObjectType, GraphQLInterfaceType } from 'graphql';
import { PackOptions } from '../src/pack/types';
import { createWrapper, WrapperFor } from '../src/resolver';

export const generatePackOptions: (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mixin?: Record<string, any>,
) => PackOptions = (mixin = {}) => {
  return {
    ...mixin,
    state: { ...mixin.state },
    dependencies: { ...mixin.dependencies },
  };
};

export const schema = buildSchema(`
  schema {
    query: Query
  }

  type Query {
    greeting: String!
    user: User!
  }

  type User implements Nameable{
    name: String!
  }

  interface Nameable {
    name: String!
  }
`);

export const userObjectType = schema.getType('User') as GraphQLObjectType;
export const nameableInterfaceType = schema.getType('Nameable') as GraphQLInterfaceType;
export const userObjectFields = (userObjectType as GraphQLObjectType).getFields();
export const userObjectNameField = userObjectFields['name'];

// Useful in wrapper tests where it's necessary to ensure that context is managed and
// that `pack` property is always included in context
export const wrapperThatResetsContext = createWrapper(
  'wrapper-that-resets-context',
  WrapperFor.FIELD,
  function (resolver) {
    return (a, b, _context, d) => {
      // ignore the context coming in and call resolver with an empty context object
      return resolver(a, b, {}, d);
    };
  },
);
