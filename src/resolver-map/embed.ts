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
import { combine } from '../highlight/highlighter/combine';
import { resolvesTo } from '../highlight/highlighter/resolves-to';
import { union } from '../highlight/highlighter/union';
import { interfaces } from '../highlight/highlighter/interface';

export type EmbedOptions = {
  wrappers?: Wrapper[];
  resolver?: FieldResolver | TypeResolver;
} & HighlightableMiddlewareOptions;

export function embed({
  resolver: resolverOption,
  highlight: coercibleHighlight = defaultHighlightCallback,
  wrappers = [],
  replace: replaceOption = false,
}: EmbedOptions): ResolverMapMiddleware {
  return async (resolverMap, packOptions): Promise<ResolverMap> => {
    const schema = packOptions.dependencies.graphqlSchema as GraphQLSchema;

    if (!schema) {
      throw new Error(
        `"graphqlSchema" expected on packOptions.dependencies. Specify it on the dependencies of the \`pack\``,
      );
    }

    const highlight = coerceHighlight(schema, coercibleHighlight).clone();
    highlight.filter(combine(resolvesTo(), union(), interfaces()));

    for (const reference of highlight.references) {
      const existingResolver = resolverForReference(resolverMap, reference);
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

      const wrappedResolver = await wrapResolver(resolverToEmbed, [...wrappers, embedPackOptionsWrapper], {
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
