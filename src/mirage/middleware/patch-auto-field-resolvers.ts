import { mirageRootQueryResolver } from '../resolvers/root-query';
import { mirageObjectResolver } from '../resolvers/object';
import { GraphQLSchema } from 'graphql';
import { isRootQueryType } from '../../utils';
import { patchEachField } from '../..';
import { ResolverMapMiddleware } from '../../types';

export const patchAutoFieldResolvers = (): ResolverMapMiddleware =>
  patchEachField(({ type, packOptions }) => {
    const schema = packOptions.dependencies.graphqlSchema as GraphQLSchema;
    const rootMutationTypeName = schema.getMutationType()?.name;
    const isRootMutationType = rootMutationTypeName && rootMutationTypeName === type.name;
    const isGraphQLInternalType = type.name.indexOf('__') === 0;
    const isRootQuery = isRootQueryType(type, schema);

    if (isRootQuery) {
      return mirageRootQueryResolver;
    }

    const skipAutoResolving = isRootMutationType || isGraphQLInternalType;
    if (skipAutoResolving) {
      return;
    }

    return mirageObjectResolver;
  });
