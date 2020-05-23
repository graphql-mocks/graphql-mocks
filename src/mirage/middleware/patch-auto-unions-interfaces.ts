import {
  GraphQLTypeResolver,
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLSchema,
  GraphQLResolveInfo,
  GraphQLAbstractType,
} from 'graphql';
import { PackOptions, ResolverMap } from '../../types';
import { mirageUnionResolver } from '../resolvers/union';
import { mirageInterfaceResolver } from '../resolvers/interface';
import { embedPackOptionsInContext } from '../../utils';

export function patchUnionsInterfaces(resolverMap: ResolverMap, packOptions: PackOptions): ResolverMap {
  const { graphqlSchema: schema } = packOptions.dependencies;
  const typeMap = (schema as GraphQLSchema).getTypeMap();

  for (const typeKey of Object.keys(typeMap)) {
    const type = typeMap[typeKey];

    const alreadyHasResolveTypeResolver = resolverMap[type.name] && '__resolveType' in [type.name];
    if (alreadyHasResolveTypeResolver) {
      continue;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let patchResolver: GraphQLTypeResolver<any, any>;
    if (type instanceof GraphQLUnionType) {
      patchResolver = mirageUnionResolver;
    } else if (type instanceof GraphQLInterfaceType) {
      patchResolver = mirageInterfaceResolver;
    } else {
      continue;
    }

    if (typeof patchResolver === 'function') {
      resolverMap[type.name] = resolverMap[type.name] || {};

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wrappedTypeResolver: GraphQLTypeResolver<any, any> = async (
        object: Record<string, unknown>,
        context: Record<string, unknown>,
        info: GraphQLResolveInfo,
        abstractType: GraphQLAbstractType,
      ) => {
        context = embedPackOptionsInContext(context, packOptions);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return await (patchResolver as GraphQLTypeResolver<any, any>)(object, context, info, abstractType);
      };

      resolverMap[type.name].__resolveType = wrappedTypeResolver;
    }
  }

  return resolverMap;
}
