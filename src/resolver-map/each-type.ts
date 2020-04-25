import { GraphQLType, GraphQLSchema } from 'graphql';
import { ResolverMapWrapper, ResolverMap, PackOptions } from '../types';

type WithType = {
  type: GraphQLType;
  resolvers: ResolverMap;
  packOptions: PackOptions;
};

type PatchOptions = {
  withType({ type, resolvers, packOptions }: WithType): void;
};

export const eachType = (options: PatchOptions): ResolverMapWrapper => (
  resolvers: ResolverMap,
  packOptions: PackOptions,
) => {
  const { graphqlSchema: schema } = packOptions.dependencies;
  const typeMap = (schema as GraphQLSchema).getTypeMap();

  for (const type of Object.values(typeMap)) {
    options.withType({ type, resolvers, packOptions });
  }

  return resolvers;
};
