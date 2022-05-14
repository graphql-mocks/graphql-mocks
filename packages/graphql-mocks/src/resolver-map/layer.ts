import { ResolverMapMiddleware, ResolverMap, ObjectField } from '../types';
import { ReplaceableResolverOption, WrappableOption } from './types';
import { pack } from '../pack';
import { mergeDeepRight } from 'ramda';
import { hi, fromResolverMap } from '../highlight';
import { GraphQLSchema, GraphQLObjectType, GraphQLAbstractType } from 'graphql';
import { walk } from '../highlight/utils';
import { getResolver } from './get-resolver';
import { setResolver } from './set-resolver';
import { applyWrappers } from '../resolver';
import { Packed } from '../pack/types';

type LayerOptions = ReplaceableResolverOption & WrappableOption;

export function layer(partials: ResolverMap[], options?: LayerOptions): ResolverMapMiddleware {
  options = {
    replace: false,
    wrappers: [],
    ...options,
  };

  const layerMiddlewares = partials.map((resolverMap) => (previous: ResolverMap): ResolverMap => {
    return mergeDeepRight(previous, resolverMap);
  });

  const middleware: ResolverMapMiddleware = async function layerMiddleware(resolverMap, packOptions) {
    const { graphqlSchema }: { graphqlSchema?: GraphQLSchema } = packOptions.dependencies;
    if (!graphqlSchema) throw new Error('`graphqlSchema` is a required dependency');

    const packed: Packed = await pack({}, layerMiddlewares, packOptions);
    const layeredResolverMap = packed.resolverMap;
    const resolverMapReferences = hi(graphqlSchema).include(fromResolverMap(layeredResolverMap)).references;

    // walk references from the resulting layeredResolverMap and apply them to
    // the final resolverMap for this middlware with any provided wrappers
    await walk(graphqlSchema, resolverMapReferences, async function ({ reference, type, field }) {
      let resolver = getResolver(layeredResolverMap, reference);

      if (resolver && options?.wrappers?.length) {
        resolver = await applyWrappers(resolver, options.wrappers, {
          schema: graphqlSchema,
          resolverMap,
          packOptions,
          type: type as GraphQLObjectType | GraphQLAbstractType,
          field: field as ObjectField,
        });
      }

      if (resolver) {
        setResolver(resolverMap, reference, resolver, { replace: options?.replace });
      }
    });

    return resolverMap;
  };

  return middleware;
}
