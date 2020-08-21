import { GraphQLSchema, GraphQLNamedType } from 'graphql';
import { TypeReference } from '../types';

export function typeForReference(schema: GraphQLSchema, reference: TypeReference): GraphQLNamedType | undefined {
  return schema.getType(reference) ?? undefined;
}
