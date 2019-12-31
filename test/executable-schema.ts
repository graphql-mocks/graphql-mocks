import {graphql, buildSchema} from 'graphql'
import {makeExecutableSchema} from 'graphql-tools';
import {importSchema} from 'graphql-import';
import defaultResolvers from './resolvers';
import fillInMissingResolvers from '../src/mirage/fill-missing-resolvers';
import {server as mirageServer} from './mirage'
import path from 'path';

const schemaPath = path.resolve(__dirname, 'schema.graphql');
const typeDefs = importSchema(schemaPath);

const tempSchema = buildSchema(typeDefs);
const typeMap = tempSchema.getTypeMap();
const mirageGraphQLMap: any = [];

const resolvers = fillInMissingResolvers(mirageServer, mirageGraphQLMap)(tempSchema, defaultResolvers);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export const graphQLHandler = (query: any, variables: any = {}) => graphql(
  schema, query, null, null, variables
);
