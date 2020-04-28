import { GraphQLInterfaceType, GraphQLUnionType, GraphQLSchema } from 'graphql';
import { Resolver, PackOptions, ResolverMap } from '../../types';
import { mirageUnionResolver } from '../../mirage/resolvers/union';
import { mirageInterfaceResolver } from '../../mirage/resolvers/interface';
import { embedPackOptions } from '../../utils';

export function patchUnionsInterfaces(resolvers: ResolverMap, packOptions: PackOptions): ResolverMap {
  const { graphqlSchema: schema } = packOptions.dependencies;
  const typeMap = (schema as GraphQLSchema).getTypeMap();

  for (const typeKey of Object.keys(typeMap)) {
    const type = typeMap[typeKey];

    const alreadyHasResolveTypeResolver = resolvers[type.name] && '__resolveType' in [type.name];
    if (alreadyHasResolveTypeResolver) {
      continue;
    }

    let patchResolver: Resolver;
    if (type instanceof GraphQLUnionType) {
      patchResolver = mirageUnionResolver;
    } else if (type instanceof GraphQLInterfaceType) {
      patchResolver = mirageInterfaceResolver;
    } else {
      continue;
    }

    if (typeof patchResolver === 'function') {
      resolvers[type.name] = resolvers[type.name] || {};
      resolvers[type.name].__resolveType = embedPackOptions(patchResolver, packOptions);
    }
  }

  return resolvers;
}
