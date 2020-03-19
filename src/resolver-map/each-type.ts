import { GraphQLSchema, GraphQLType } from 'graphql';
import { ResolverMapWrapper, ResolverMap } from '../types';

type PatchOptions = {
  withType({ type, resolvers }: { type: GraphQLType; resolvers: ResolverMap }): void;
};

export const eachType = (schema: GraphQLSchema, options: PatchOptions): ResolverMapWrapper => (
  resolvers: ResolverMap,
) => {
  const typeMap = schema.getTypeMap();

  for (const type of Object.values(typeMap)) {
    options.withType({ type, resolvers });
  }

  return resolvers;
};
