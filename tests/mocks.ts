import { buildSchema, GraphQLObjectType } from 'graphql';
import { PackOptions } from '../src/types';

export const generatePackOptions: (mixin?: Record<any, any>) => PackOptions = (mixin = {}) => {
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

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const userObjectType = schema.getType('User')! as GraphQLObjectType;
export const userObjectFields = (userObjectType as GraphQLObjectType).getFields();
export const userObjectNameField = userObjectFields['name'];
