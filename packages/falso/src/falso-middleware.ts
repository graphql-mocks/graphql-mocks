import { GraphQLSchema } from 'graphql';
import { ResolverMap, ResolverMapMiddleware } from 'graphql-mocks/types';
import { highlightAllCallback } from 'graphql-mocks/resolver-map/utils';
import { falsoFieldResolver } from './falso-field-resolver';
import { FalsoMiddlewareOptions } from './types';
import { falsoTypeResolver } from './falso-type-resolver';
import { fromResolverMap, combine, union, interfaces, field } from 'graphql-mocks/highlight';
import { coerceHighlight, walk } from 'graphql-mocks/highlight/utils';
import { setResolver } from 'graphql-mocks/resolver-map';

export function falsoMiddleware(options?: FalsoMiddlewareOptions): ResolverMapMiddleware {
  const falsoOptions = options ?? {};

  return async (resolverMap, packOptions): Promise<ResolverMap> => {
    const graphqlSchema = packOptions.dependencies.graphqlSchema as GraphQLSchema;
    let highlight = coerceHighlight(graphqlSchema, options?.highlight ?? highlightAllCallback);

    // If we can't replace resolvers, exclude the ones that exist in the resolver map
    if (!options?.replace) {
      highlight = highlight.exclude(fromResolverMap(resolverMap));
    }

    const fieldResolvableHighlight = highlight.filter(field());
    const fieldResolver = falsoFieldResolver(falsoOptions);
    await walk(graphqlSchema, fieldResolvableHighlight.references, ({ reference }) => {
      setResolver(resolverMap, reference, fieldResolver, {
        graphqlSchema,
        replace: options?.replace,
      });
    });

    const typeResolvableHighlight = highlight.filter(combine(union(), interfaces()));
    const typeResolver = falsoTypeResolver();
    await walk(graphqlSchema, typeResolvableHighlight.references, ({ reference }) => {
      setResolver(resolverMap, reference, typeResolver, {
        graphqlSchema,
        replace: options?.replace,
      });
    });

    return resolverMap;
  };
}
