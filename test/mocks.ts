import { buildSchema, GraphQLObjectType } from 'graphql';
import { MirageGraphQLMapper } from '../src/mirage/mapper';
import { PackOptions } from '../src/pack/types';

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

  type User {
    name: String!
  }
`);

export const userObjectType = schema.getType('User') as GraphQLObjectType;
export const userObjectFields = (userObjectType as GraphQLObjectType).getFields();
export const userObjectNameField = userObjectFields['name'];

export const createEmptyMirageMapper = (): MirageGraphQLMapper => new MirageGraphQLMapper();
