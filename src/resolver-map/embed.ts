import { GraphQLSchema } from 'graphql';
import { wrapResolver } from '../resolver/wrap';
import { Resolver, ResolverWrapper, ResolverMapMiddleware, ResolverMap } from '../types';
import { expand, SPECIAL_TYPE_TARGET, SPECIAL_FIELD_TARGET } from './reference/target-reference';
import { difference } from './reference/field-reference';
import { getTypeAndFieldDefinitions } from '../graphql/utils';
import { TargetableMiddlewareOptions } from './types';
import { embedPackOptionsWrapper } from '../pack/utils';
import { addResolverToMap } from './add-resolver';

export type EmbedOptions = {
  wrappers?: ResolverWrapper[];
  resolver?: Resolver;
} & TargetableMiddlewareOptions;

export function embed({
  include = [SPECIAL_TYPE_TARGET.ALL_TYPES, SPECIAL_FIELD_TARGET.ALL_FIELDS],
  exclude = [],
  wrappers = [],
  resolver: resolverToApply,
  replace: replaceOption = false,
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
      // as to not replace the global values
      let shouldReplace = replaceOption;
      let resolver = resolverToApply;

      if (typeof resolver !== 'function') {
        resolver = resolverMap[typeName]?.[fieldName] as Resolver;

        // we are using the existing resolver to wrap and to put it back
        // in the resolver map. we will need to replace the original
        // with the wrapped
        shouldReplace = true;
      }

      // No resolver in the Resolver Map; continue.
      if (!resolver) {
        continue;
      }

      const [type, field] = getTypeAndFieldDefinitions(schema, [typeName, fieldName]);

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
        replace: shouldReplace,
      });
    }

    return resolverMap;
  };
}
