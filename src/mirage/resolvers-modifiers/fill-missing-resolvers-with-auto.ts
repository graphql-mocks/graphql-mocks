import {GraphQLObjectType} from 'graphql';

export const mirageFieldResolver = (mirageServer: any, mirageType: string, mirageField: string) => (parent: any) => {
  const resolvedModel = parent;

  if (!resolvedModel) {
    throw new Error(`Could not resolve model from parent, got ${typeof parent}`);
  }

  if (!resolvedModel[mirageField]) {
    throw new Error(`${mirageField} does not exist on mirage type: ${mirageType} with id: ${parent.id}`);
  }

  const resolvedField = resolvedModel[mirageField].models ? resolvedModel[mirageField].models : resolvedModel[mirageField];
  return resolvedField;
}

// iterate over all types and fields as given by the schema
// then if any resolvers are missing, patch them with an
// auto mirage field resolver.
export default (mirageServer: any, mirageGraphQLMap: any, schema: any) => (resolvers: any) => {
  const typeMap = schema.getTypeMap();

  for (const type of Object.keys(typeMap)) {
    if (typeMap[type] instanceof GraphQLObjectType) {
      const fields = (typeMap[type] as GraphQLObjectType).getFields();

      for (const field of Object.keys(fields)) {
        resolvers[type] = resolvers[type] || {};

        // don't want to fill in mirage resolvers fill for internal types like __Type
        const isGraphQLInternalType = type.indexOf('__') === 0;

        if (type === 'Query' || type === 'Mutation' || isGraphQLInternalType) {
          continue;
        }

        if (!resolvers[type][field]) {
          const match = mirageGraphQLMap.find(
            (mapDefinition: any) => mapDefinition.graphql[0] === type && mapDefinition.graphql[1] === field
          );

          const mirageType = match ? match.mirage[0] : type;
          const mirageField = match ?  match.mirage[1] : field;
          resolvers[type][field] = mirageFieldResolver(mirageServer, mirageType, mirageField);
        }
      }
    }
  }

  return resolvers;
}
