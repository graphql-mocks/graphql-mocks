import { GraphQLSchema, isAbstractType, GraphQLField, assertObjectType, isObjectType } from 'graphql';
import { wrapResolver } from '../resolver/wrap';
import { FieldResolver, ResolverMapMiddleware, ResolverMap, TypeResolver, Wrapper } from '../types';
import { addResolverToMap } from './add-resolver';
import { HighlightableMiddlewareOptions } from './types';
import { defaultHighlightCallback } from './highlight-defaults';
import { coerceHighlight, resolverForReference } from './utils';
import { isTypeReference } from '../highlight/utils/is-type-reference';
import { isFieldReference } from '../highlight/utils/is-field-reference';
import { embedPackOptionsWrapper } from '../pack';

export type EmbedOptions = {
  wrappers?: Wrapper[];
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

    const highlight = coerceHighlight(schema, coercibleHighlight);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let field: GraphQLField<any, any> | undefined;
      if (isTypeReference(reference)) {
        type = highlight.instances.types[reference].type;

        if (!isAbstractType(type)) {
          throw new Error(
            `Tried to embed a Type Resolver, expected a Union or Interface type in schema for ${type.name}`,
          );
        }
      } else if (isFieldReference(reference)) {
        const [typeName, fieldName] = reference;
        type = highlight.instances.types[typeName].type;
        assertObjectType(type);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        field = highlight.instances.types[typeName]?.fields?.[fieldName] as GraphQLField<any, any>;

        if (!field) {
          throw new Error(
            `Tried to embed a Field Resolver, expected Field ["${typeName}", "${fieldName}"] to exist in the schema`,
          );
        }
      }

      if (!type || (!isObjectType(type) && !isAbstractType(type))) {
        throw new Error(
          `reference ${JSON.stringify(reference)} could not be resolved to a GraphQL Object, Union or Interface type`,
        );
      }

      const wrappedResolver = await wrapResolver(resolver, [...wrappers, embedPackOptionsWrapper], {
        type,
        schema,
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
