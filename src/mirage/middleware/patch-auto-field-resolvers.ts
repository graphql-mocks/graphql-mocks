import { GraphQLSchema } from 'graphql';
import { mirageRootQueryResolver } from '../resolver/root-query';
import { mirageObjectResolver } from '../resolver/object';
import { ResolverMapMiddleware, ResolverMap } from '../../types';
import { walk } from '../../utils/walk';
import { isRootQueryType, isRootMutationType, isInternalType } from '../../graphql/utils';
import { resolverExistsInResolverMap } from '../../resolver-map/utils';
import { TargetableMiddlewareOptions, defaultTargetableOptions } from '../../resolver-map/types';
import { PackOptions } from '../../pack/types';
import { addResolverToMap } from '../../resolver-map';

export function patchAutoFieldResolvers(
  options: TargetableMiddlewareOptions = defaultTargetableOptions,
): ResolverMapMiddleware {
  return async (resolverMap: ResolverMap, packOptions: PackOptions): Promise<ResolverMap> => {
    options = {
      ...defaultTargetableOptions,
      ...options,
    };

    const { include, exclude } = options;

    const graphqlSchema = packOptions.dependencies.graphqlSchema as GraphQLSchema;

    if (!graphqlSchema) {
      throw new Error('graphqlSchema is required in dependencies to patch field resolvers');
    }

    await walk(
      {
        include,
        exclude,
        graphqlSchema,
      },
      async (fieldReference) => {
        const [typeName] = fieldReference;
        const isRootQuery = isRootQueryType(graphqlSchema, typeName);
        const isRootMutation = isRootMutationType(graphqlSchema, typeName);

        if (resolverExistsInResolverMap(resolverMap, fieldReference)) {
          return;
        }

        if (isRootMutation || isInternalType(typeName)) {
          return;
        }

        let resolver;
        if (isRootQuery) {
          resolver = mirageRootQueryResolver;
        } else {
          resolver = mirageObjectResolver;
        }

        addResolverToMap({
          resolverMap: resolverMap,
          fieldReference: fieldReference,
          resolver,
        });
      },
    );

    return resolverMap;
  };
}
