import { buildSchema, graphql } from 'graphql';
import { addResolversToSchema } from 'graphql-tools';
import { readFileSync } from 'fs';
import path from 'path';

const schemaPath = path.resolve(__dirname, 'schema.graphql');
export const typeDefs = readFileSync(schemaPath, 'utf-8');
export const graphqlSchema = buildSchema(typeDefs);

export function buildHandler(resolvers: any) {
  const graphqlSchema = buildSchema(typeDefs);
  addResolversToSchema(graphqlSchema, resolvers);
  const graphQLHandler = (query: any, variables: any = {}) => graphql(graphqlSchema, query, resolvers, null, variables);
  return graphQLHandler;
}
