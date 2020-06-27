import { GraphQLSchema } from 'graphql';
import { wrapResolver } from './wrap';
import {
  Resolver,
  ResolverWrapper,
  ResolverMapMiddleware,
  ResolverMap,
  TargetReference,
  SPECIAL_TYPE_TARGET,
  SPECIAL_FIELD_TARGET,
} from '../types';
import { getTypeAndFieldDefinitions, addResolverToMap, embedPackOptionsWrapper } from '../utils';
import { expandTarget } from '../resolver-map/utils/expand-target';

export type EmbedOptions = {
  target?: TargetReference;
  wrappers?: ResolverWrapper[];
  resolver?: Resolver;
  overwrite?: boolean;
};

export function embed({
  target = [SPECIAL_TYPE_TARGET.ALL_TYPES, SPECIAL_FIELD_TARGET.ALL_FIELDS],
  wrappers = [],
  resolver: resolverToApply,
  overwrite: overwriteOption = false,
}: EmbedOptions): ResolverMapMiddleware {
  return (resolverMap, packOptions): ResolverMap => {
    const schema = packOptions.dependencies.graphqlSchema as GraphQLSchema;

    if (!schema) {
      throw new Error(
        `"graphqlSchema" expected on packOptions.dependencies. Specify it on the dependencies of the \`pack\``,
      );
    }

    const fieldReferences = expandTarget(target, schema);
    fieldReferences.forEach(([typeName, fieldName]) => {
      // these MUST be kept in the local iteration
      // as to not overwrite the global values
      let shouldOverwrite = overwriteOption;
      let resolver = resolverToApply;

      if (typeof resolver !== 'function') {
        resolver = resolverMap[typeName]?.[fieldName] as Resolver;

        // we are using the existing resolver to wrap and to put it back
        // in the resolver map. we will need to overwrite the original
        // with the wrapped
        shouldOverwrite = true;
      }

      // No resolver in the Resolver Map; continue.
      if (!resolver) {
        return;
      }

      const [type, field] = getTypeAndFieldDefinitions([typeName, fieldName], schema);

      const wrappedResolver = wrapResolver(resolver, [...wrappers, embedPackOptionsWrapper], {
        type,
        field,
        resolverMap,
        packOptions,
      });

      addResolverToMap({
        resolverMap,
        fieldReference: [typeName, fieldName],
        resolver: wrappedResolver,
        overwrite: shouldOverwrite,
      });
    });

    return resolverMap;
  };
}
