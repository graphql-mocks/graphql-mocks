import { buildSchema, graphql } from 'graphql';
import { addResolversToSchema } from 'graphql-tools';
import { readFileSync } from 'fs';
import path from 'path';
import { ResolverMap } from '../../../src/types';

const schemaPath = path.resolve(__dirname, 'schema.graphql');
export const typeDefs = readFileSync(schemaPath, 'utf-8');
export const graphqlSchema = buildSchema(typeDefs);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildHandler(resolvers: ResolverMap): any {
  const graphqlSchema = buildSchema(typeDefs);
  addResolversToSchema(graphqlSchema, resolvers);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphQLHandler = (query: string, variables: Record<string, unknown> = {}): Promise<any> =>
    graphql(graphqlSchema, query, resolvers, null, variables);

  return graphQLHandler;
}
