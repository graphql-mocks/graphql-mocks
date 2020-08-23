import { GraphQLSchema, isAbstractType, GraphQLField, assertObjectType } from 'graphql';
import { wrapResolver } from '../resolver/wrap';
import { FieldResolver, ResolverWrapper, ResolverMapMiddleware, ResolverMap, TypeResolver } from '../types';
import { embedPackOptionsWrapper } from '../pack/utils';
import { addResolverToMap } from './add-resolver';
import { HighlightableMiddlewareOptions, CoercibleHighlight } from './types';
import { defaultHighlightCallback } from './highlight-defaults';
import { coerceHighlight, resolverForReference } from './utils';
import { isTypeReference } from '../highlight/utils/is-type-reference';
import { isFieldReference } from '../highlight/utils/is-field-reference';

export type EmbedOptions = {
  wrappers?: ResolverWrapper[];
  resolver?: FieldResolver | TypeResolver;
} & HighlightableMiddlewareOptions;

export function embed({
  highlight: coercibleHighlight = defaultHighlightCallback,
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

    const highlight = coerceHighlight(schema, coercibleHighlight as CoercibleHighlight);
    // highlight.include();
    const references = highlight.references;

    for (const reference of references) {
      // these MUST be kept in the local iteration
      // as to not replace the default option values
      let shouldReplace = replaceOption;
      let resolver = resolverToApply;

      if (typeof resolver !== 'function') {
        const existingResolver = resolverForReference(resolverMap, reference);

        // we are using the existing resolver to wrap and to put it back
        // in the resolver map. we will need to replace the original
        // with the wrapped
        shouldReplace = true;
        resolver = existingResolver;
      }

      // No resolver in the Resolver Map; continue.
      if (!resolver) {
        continue;
      }

      let type;
      let field: GraphQLField<any, any> | undefined;
      if (isTypeReference(reference)) {
        const type = highlight.instances.types[reference];

        if (!isAbstractType(type)) {
          throw new Error(`Tried to embed a Type Resolver, expected a Union or Interface type in schema for ${type}`);
        }
      } else if (isFieldReference(reference)) {
        const [typeName, fieldName] = reference;
        const type = highlight.instances.types[typeName];
        assertObjectType(type);

        if (!type) {
          throw new Error(`Tried to embed a Field Resolver, expected Type ${typeName} to exist in the schema`);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        field = highlight.instances.types[typeName]?.fields?.[fieldName] as GraphQLField<any, any>;

        if (!field) {
          throw new Error(
            `Tried to embed a Field Resolver, expected Field ["${typeName}", "${fieldName}"] to exist in the schema`,
          );
        }
      } else {
        throw new Error(`reference ${reference} could not be resolved to a Type Reference or Field Reference`);
      }

      const wrappedResolver = await wrapResolver(resolver, [...wrappers, embedPackOptionsWrapper], {
        type,
        field,
        resolverMap,
        packOptions,
      });

      addResolverToMap({
        resolverMap,
        graphqlSchema: schema,
        reference,
        resolver: wrappedResolver,
        replace: shouldReplace,
      });
    }

    return resolverMap;
  };
}
