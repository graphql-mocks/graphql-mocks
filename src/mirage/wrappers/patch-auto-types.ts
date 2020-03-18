import { GraphQLSchema } from 'graphql';
import { mirageAutoObjectResolver } from '../resolvers/auto';
import { ResolverMapWrapper } from '../../types';
import { patch } from '../../resolver-map/patch-each';

export const patchWithAutoTypesWrapper = function(schema: GraphQLSchema): ResolverMapWrapper {
  return patch(schema, {
    patchWith({ type }) {
      const isRootQueryType = type.name === 'Query';
      const isRootMutationType = type.name === 'Mutation';
      const isGraphQLInternalType = type.name.indexOf('__') === 0;

      const skipAutoResolving = isRootQueryType || isRootMutationType || isGraphQLInternalType;
      if (skipAutoResolving) {
        return;
      }

      return mirageAutoObjectResolver;
    },
  });
};
