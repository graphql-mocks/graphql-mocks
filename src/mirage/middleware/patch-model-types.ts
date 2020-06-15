import { mirageObjectResolver } from '../resolvers/object';
import { mirageRelayResolver } from '../resolvers/relay';
import { mirageRootQueryResolver } from '../resolvers/root-query';
import { patchEachField } from '../../resolver-map/patch-each-field';
import { unwrap } from '../../utils';
import { GraphQLObjectType, GraphQLField, GraphQLSchema } from 'graphql';

export const patchModelTypes = patchEachField(({ type, field, packOptions }) => {
  const schema = packOptions.dependencies.graphqlSchema as GraphQLSchema;

  const rootQueryTypeName = schema.getQueryType()?.name;
  const rootMutationTypeName = schema.getMutationType()?.name;
  const isRootQueryType = rootQueryTypeName && rootQueryTypeName === type.name;
  const isRootMutationType = rootMutationTypeName && rootMutationTypeName === type.name;
  const isGraphQLInternalType = type.name.indexOf('__') === 0;

  if (!(type instanceof GraphQLObjectType)) {
    throw new TypeError('field must be an instanceof GraphQLField for patching');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unwrappedReturnType = unwrap((field as GraphQLField<any, any>).type);

  if ('name' in unwrappedReturnType && unwrappedReturnType.name.endsWith('Connection')) {
    return mirageRelayResolver;
  }

  if (isRootQueryType) {
    return mirageRootQueryResolver;
  }

  const skipAutoResolving = isRootMutationType || isGraphQLInternalType;
  if (skipAutoResolving) {
    return;
  }

  return mirageObjectResolver;
});
