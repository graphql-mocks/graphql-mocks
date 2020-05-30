import { ResolverMap } from '../types';
import { GraphQLSchema, GraphQLInterfaceType, GraphQLUnionType, GraphQLObjectType } from 'graphql';

export function addTypeResolversToSchema(resolverMap: ResolverMap, schema: GraphQLSchema): void {
  for (const typeName in resolverMap) {
    const type = schema.getType(typeName);

    //  Note: __resolveType for type resolvers is a convention borrowed from
    //  graphql-tools resolver maps. This allows a single ResolverMap to be used
    // for both type resolvers for abstract types (unions & interfaces), as well
    // as field resolvers
    const typeResolver = resolverMap[typeName].__resolveType;
    const hasTypeResolver = Boolean(typeResolver);

    if (hasTypeResolver && (type instanceof GraphQLInterfaceType || type instanceof GraphQLUnionType)) {
      type.resolveType = typeResolver;
    }
  }
}

export function addFieldResolverstoSchema(resolverMap: ResolverMap, schema: GraphQLSchema): void {
  for (const typeName in resolverMap) {
    const type = schema.getType(typeName);

    if (!(type instanceof GraphQLObjectType)) {
      continue;
    }

    for (const fieldName in resolverMap[typeName]) {
      const fieldMap = type.getFields();
      fieldMap[fieldName].resolve = resolverMap[typeName][fieldName];
    }
  }
}
