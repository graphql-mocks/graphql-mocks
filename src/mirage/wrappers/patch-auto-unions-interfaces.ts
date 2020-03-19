import { eachType } from '../../resolver-map/each-type';
import { GraphQLSchema, GraphQLInterfaceType, GraphQLUnionType } from 'graphql';
import { ResolverMapWrapper } from '../../types';
import { mirageAutoUnionResolver } from '../../mirage/resolvers/auto';

export const patchAutoUnionsInterfaces = (schema: GraphQLSchema): ResolverMapWrapper => {
  return eachType(schema, {
    withType({ resolvers, type }) {
      if (type instanceof GraphQLUnionType || type instanceof GraphQLInterfaceType) {
        const alreadyHasResolveTypeResolver = resolvers[type.name]?.__resolveType;

        if (!alreadyHasResolveTypeResolver) {
          resolvers[type.name] = resolvers[type.name] || {};
          resolvers[type.name].__resolveType = mirageAutoUnionResolver;
        }
      }
    },
  });
};
