import { GraphQLSchema } from 'graphql';
import { wrapResolver } from '../resolver/wrap';
import { Resolver, ResolverWrapper, ResolverMapMiddleware, ResolverMap } from '../types';
import { expand, SPECIAL_TYPE_TARGET, SPECIAL_FIELD_TARGET } from './reference/target-reference';
import { difference } from './reference/field-reference';
import { getTypeAndFieldDefinitions } from '../graphql/utils';
import { embedPackOptionsWrapper, addResolverToMap } from './utils';
import { IncludeExcludeMiddlewareOptions } from './types';

export type EmbedOptions = {
  wrappers?: ResolverWrapper[];
  resolver?: Resolver;
  overwrite?: boolean;
} & IncludeExcludeMiddlewareOptions;

export function embed({
  include = [SPECIAL_TYPE_TARGET.ALL_TYPES, SPECIAL_FIELD_TARGET.ALL_FIELDS],
  exclude = [],
  wrappers = [],
  resolver: resolverToApply,
  overwrite: overwriteOption = false,
}: EmbedOptions): ResolverMapMiddleware {
  return async (resolverMap, packOptions): Promise<ResolverMap> => {
    const schema = packOptions.dependencies.graphqlSchema as GraphQLSchema;

    if (!schema) {
      throw new Error(
        `"graphqlSchema" expected on packOptions.dependencies. Specify it on the dependencies of the \`pack\``,
      );
    }

    const includedFieldReferences = expand(include, schema) ?? [];
    const excludedFieldReferences = expand(exclude, schema) ?? [];
    const fieldReferences = difference(includedFieldReferences, excludedFieldReferences);

    for (const [typeName, fieldName] of fieldReferences) {
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
        continue;
      }

      const [type, field] = getTypeAndFieldDefinitions([typeName, fieldName], schema);

      const wrappedResolver = await wrapResolver(resolver, [...wrappers, embedPackOptionsWrapper], {
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
    }

    return resolverMap;
  };
}
