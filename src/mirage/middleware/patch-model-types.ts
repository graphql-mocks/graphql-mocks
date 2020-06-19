import { mirageObjectResolver } from '../resolvers/object';
import { mirageRootQueryResolver } from '../resolvers/root-query';
import { patchEachField } from '../../resolver-map/patch-each-field';
import { isRootQueryType } from '../../utils';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';

export const patchModelTypes = patchEachField(({ type, packOptions }) => {
  const schema = packOptions.dependencies.graphqlSchema as GraphQLSchema;
  const rootMutationTypeName = schema.getMutationType()?.name;
  const isRootQuery = isRootQueryType(type, schema);
  const isRootMutationType = rootMutationTypeName && rootMutationTypeName === type.name;
  const isGraphQLInternalType = type.name.indexOf('__') === 0;

  if (!(type instanceof GraphQLObjectType)) {
    throw new TypeError('field must be an instanceof GraphQLField for patching');
  }

  if (isRootQuery) {
    return mirageRootQueryResolver;
  }

  const skipAutoResolving = isRootMutationType || isGraphQLInternalType;
  if (skipAutoResolving) {
    return;
  }

  return mirageObjectResolver;
});
