import {graphql} from 'graphql'
import { makeExecutableSchema } from 'graphql-tools';
import {importSchema} from 'graphql-import';
import resolvers from './resolvers';
import path from 'path';

const schemaPath = path.resolve(__dirname, 'schema.graphql');
const typeDefs = importSchema(schemaPath);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export const graphQLHandler = (query: any, variables: any = {}) => graphql(
  schema, query, null, null, variables
);
