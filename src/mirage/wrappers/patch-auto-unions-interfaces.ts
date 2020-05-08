import {
  GraphQLTypeResolver,
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLSchema,
  GraphQLResolveInfo,
  GraphQLAbstractType,
} from 'graphql';
import { PackOptions, ResolverMap } from '../../types';
import { mirageUnionResolver } from '../../mirage/resolvers/union';
import { mirageInterfaceResolver } from '../../mirage/resolvers/interface';
import { embedPackOptionsInContext } from '../../utils';

export function patchUnionsInterfaces(resolvers: ResolverMap, packOptions: PackOptions): ResolverMap {
  const { graphqlSchema: schema } = packOptions.dependencies;
  const typeMap = (schema as GraphQLSchema).getTypeMap();

  for (const typeKey of Object.keys(typeMap)) {
    const type = typeMap[typeKey];

    const alreadyHasResolveTypeResolver = resolvers[type.name] && '__resolveType' in [type.name];
    if (alreadyHasResolveTypeResolver) {
      continue;
    }

    let patchResolver: GraphQLTypeResolver<any, any>;
    if (type instanceof GraphQLUnionType) {
      patchResolver = mirageUnionResolver;
    } else if (type instanceof GraphQLInterfaceType) {
      patchResolver = mirageInterfaceResolver;
    } else {
      continue;
    }

    if (typeof patchResolver === 'function') {
      resolvers[type.name] = resolvers[type.name] || {};

      const wrappedTypeResolver = async (
        object: Record<string, any>,
        context: Record<string, any>,
        info: GraphQLResolveInfo,
        abstractType: GraphQLAbstractType,
      ): Promise<ReturnType<GraphQLTypeResolver<any, any>>> => {
        context = embedPackOptionsInContext(context, packOptions);
        return await (patchResolver as GraphQLTypeResolver<any, any>)(object, context, info, abstractType);
      };

      resolvers[type.name].__resolveType = wrappedTypeResolver;
    }
  }

  return resolvers;
}
