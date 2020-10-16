import { GraphQLSchema } from 'graphql';
import { ResolverMap } from '../../types';
import { attachFieldResolversToSchema } from './attach-field-resolvers-to-schema';
import { attachTypeResolversToSchema } from './attach-type-resolvers-to-schema';

export function attachResolversToSchema(schema: GraphQLSchema, resolverMap: ResolverMap): void {
  attachTypeResolversToSchema(schema, resolverMap);
  attachFieldResolversToSchema(schema, resolverMap);
}
