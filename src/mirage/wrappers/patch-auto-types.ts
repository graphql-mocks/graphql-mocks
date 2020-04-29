import { mirageObjectResolver } from '../resolvers/object';
import { mirageRelayResolver } from '../resolvers/relay';
import { patchEachField } from '../../resolver-map/patch-each-field';
import { unwrap } from '../../utils';

export const patchWithAutoTypesWrapper = patchEachField(({ type, field }) => {
  const isRootQueryType = type.name === 'Query';
  const isRootMutationType = type.name === 'Mutation';
  const isGraphQLInternalType = type.name.indexOf('__') === 0;

  const unwrappedReturnType = unwrap(field.type);

  if ('name' in unwrappedReturnType && unwrappedReturnType.name.endsWith('Connection')) {
    return mirageRelayResolver;
  }

  const skipAutoResolving = isRootQueryType || isRootMutationType || isGraphQLInternalType;
  if (skipAutoResolving) {
    return;
  }

  return mirageObjectResolver;
});
