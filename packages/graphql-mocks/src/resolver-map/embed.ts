import { GraphQLSchema, isSchema, GraphQLNamedType, isAbstractType, isObjectType } from 'graphql';
import { applyWrappers } from '../resolver';
import { FieldResolver, ResolverMapMiddleware, ResolverMap, TypeResolver, ObjectField } from '../types';
import { setResolver } from './set-resolver';
import { ReplaceableResolverOption, HighlightableOption, WrappableOption } from './types';
import { highlightAllCallback } from './utils/highlight-all-callback';
import { getResolver } from './get-resolver';
import { isTypeReference, isFieldReference, getInstanceForReference } from '../highlight/utils';
import { coerceHighlight } from '../highlight/utils/coerce-highlight';
import { interfaces, combine, resolvesTo, union } from '../highlight';
import { embedPackOptionsWrapper } from '../pack/utils';

export type EmbedOptions = {
  resolver?: FieldResolver | TypeResolver;
} & ReplaceableResolverOption &
  HighlightableOption &
  WrappableOption;

export function embed({
  resolver: resolverOption,
  highlight: coercibleHighlight = highlightAllCallback,
  wrappers = [],
  replace: replaceOption = false,
}: EmbedOptions): ResolverMapMiddleware {
  return async (resolverMap, packOptions): Promise<ResolverMap> => {
    wrappers = [...wrappers];
    const schema = packOptions.dependencies.graphqlSchema as GraphQLSchema;

    if (!isSchema(schema)) {
      throw new Error(`"graphqlSchema" is an expected dependency, got type ${typeof schema}`);
    }

    const highlight = coerceHighlight(schema, coercibleHighlight).filter(combine(resolvesTo(), union(), interfaces()));
    for (const reference of highlight.references) {
      const existingResolver = getResolver(resolverMap, reference);
      // these MUST be kept in the local iteration
      // as to not replace the default option values
      let shouldReplace = replaceOption;
      let resolverToEmbed = resolverOption;

      if (resolverToEmbed && existingResolver && !shouldReplace) {
        const prettyReference = JSON.stringify(reference);
        throw new Error(
          `Tried to add a new resolver via \`embed\` at ${prettyReference} but a resolver already ` +
            `exists there. If this was intended use the \`replace\` option to replace the existing resolver.`,
        );
      }

      if (typeof resolverToEmbed !== 'function') {
        // we are using the existing resolver to wrap and to put it back
        // in the resolver map. we will need to replace the original
        // with the wrapped
        shouldReplace = true;
        resolverToEmbed = existingResolver;
      }

      // no resolver to operate on; skip.
      if (!resolverToEmbed) {
        continue;
      }

      let type: GraphQLNamedType | undefined;
      let field: ObjectField | undefined;
      if (isTypeReference(reference)) {
        const instance = getInstanceForReference(schema, reference);
        type = instance;
      }

      if (isFieldReference(reference)) {
        const instance = getInstanceForReference(schema, reference);
        type = instance?.[0];
        field = instance?.[1] as ObjectField;
      }

      if (!type || (!isObjectType(type) && !isAbstractType(type))) {
        throw new Error(
          `reference ${JSON.stringify(reference)} could not be resolved to a GraphQL Object, Union or Interface type`,
        );
      }

      if (wrappers?.length) {
        // if there is at least one wrapper, the embedPackOptionsWrapper should also
        // be included in order to better manage the context and ensure that the `pack`
        // property is included
        wrappers = [embedPackOptionsWrapper, ...wrappers];
        resolverToEmbed = await applyWrappers(resolverToEmbed, [...wrappers], {
          type,
          field,
          schema,
          resolverMap,
          packOptions,
        });
      }

      setResolver(resolverMap, reference, resolverToEmbed, {
        graphqlSchema: schema,
        replace: shouldReplace,
      });
    }

    return resolverMap;
  };
}
