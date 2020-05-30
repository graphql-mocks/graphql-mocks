import { buildSchema } from 'graphql';
import { readFileSync } from 'fs';
import path from 'path';

const schemaPath = path.resolve(__dirname, 'schema.graphql');
export const typeDefs = readFileSync(schemaPath, 'utf-8');
export const graphqlSchema = buildSchema(typeDefs);
