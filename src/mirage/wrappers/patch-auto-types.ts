import { mirageObjectResolver } from '../resolvers/object';
import { mirageRelayResolver } from '../resolvers/relay';
import { patchEachField } from '../../resolver-map/patch-each-field';
import { unwrap } from '../../utils';
import { GraphQLObjectType, GraphQLField } from 'graphql';

export const patchWithAutoTypesWrapper = patchEachField(({ type, field }) => {
  const isRootQueryType = type.name === 'Query';
  const isRootMutationType = type.name === 'Mutation';
  const isGraphQLInternalType = type.name.indexOf('__') === 0;

  if (!(type instanceof GraphQLObjectType)) {
    throw new TypeError('field must be an instanceof GraphQLField for patching');
  }

  const unwrappedReturnType = unwrap((field as GraphQLField<any, any>).type);

  if ('name' in unwrappedReturnType && unwrappedReturnType.name.endsWith('Connection')) {
    return mirageRelayResolver;
  }

  const skipAutoResolving = isRootQueryType || isRootMutationType || isGraphQLInternalType;
  if (skipAutoResolving) {
    return;
  }

  return mirageObjectResolver;
});
