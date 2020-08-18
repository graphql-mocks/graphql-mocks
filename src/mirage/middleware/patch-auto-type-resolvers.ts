import { GraphQLTypeResolver, GraphQLSchema, GraphQLResolveInfo, GraphQLAbstractType, isAbstractType } from 'graphql';
import { ResolverMap } from '../../types';
import { mirageAbstractTypeResolver } from '../resolver/abstract';
import { embedPackOptionsInContext } from '../../pack/utils';
import { PackOptions } from '../../pack/types';

export function patchAutoTypeResolvers(resolverMap: ResolverMap, packOptions: PackOptions): ResolverMap {
  const { graphqlSchema: schema } = packOptions.dependencies;
  const typeMap = (schema as GraphQLSchema).getTypeMap();

  for (const typeKey of Object.keys(typeMap)) {
    const type = typeMap[typeKey];

    const alreadyHasResolveTypeResolver = resolverMap[type.name] && '__resolveType' in [type.name];
    if (!isAbstractType(type) || alreadyHasResolveTypeResolver) {
      continue;
    }

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
      return await (mirageAbstractTypeResolver as GraphQLTypeResolver<any, any>)(object, context, info, abstractType);
    };

    resolverMap[type.name].__resolveType = wrappedTypeResolver;
  }

  return resolverMap;
}
