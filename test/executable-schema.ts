import {graphql, buildSchema} from 'graphql'
import {makeExecutableSchema} from 'graphql-tools';
import {importSchema} from 'graphql-import';
import path from 'path';

const schemaPath = path.resolve(__dirname, 'schema.graphql');
export const typeDefs = importSchema(schemaPath);

export function buildHandler(resolvers: any) {
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });

  const graphQLHandler = (query: any, variables: any = {}) => graphql(
    schema, query, null, null, variables
  );

  return graphQLHandler;
};
