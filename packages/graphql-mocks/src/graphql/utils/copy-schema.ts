import { GraphQLSchema, buildSchema, printSchema } from 'graphql';

export function copySchema(schema: GraphQLSchema): GraphQLSchema {
  return buildSchema(printSchema(schema));
}
