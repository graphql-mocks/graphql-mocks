import { buildSchema } from 'graphql';
import { readFileSync } from 'fs';
import path from 'path';

// eslint-disable-next-line no-undef
const schemaPath = path.resolve(__dirname, 'schema.graphql');
const typeDefs = readFileSync(schemaPath, 'utf-8');
export const graphqlSchema = buildSchema(typeDefs);
