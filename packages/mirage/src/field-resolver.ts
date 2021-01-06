import { FieldResolver } from 'graphql-mocks/types';
import { isValidModelName } from './utils';
import { isScalarType, isNamedType, GraphQLSchema } from 'graphql';
import { unwrap, hasListType } from 'graphql-mocks/graphql/type-utils';
import { extractDependencies } from 'graphql-mocks/resolver';
import { Server } from 'miragejs';

export const mirageFieldResolver: FieldResolver = function mirageObjectResolver(parent, _args, context, info) {
  const { mirageServer, graphqlSchema } = extractDependencies<{
    mirageServer: Server;
    graphqlSchema: GraphQLSchema;
  }>(context, ['mirageServer', 'graphqlSchema']);
  const { fieldName, parentType, returnType } = info;

  // This is 90% of the algorithm for "auto resolving" given a mirage model
  // Use result from parent `models` property if its a collection
  // otherwise just try the fieldName on the parent which is the default
  // method graphql uses
  let result = parent?.[fieldName]?.models ?? parent?.[fieldName];

  const unwrappedType = unwrap(returnType);
  const hasListReturnType = hasListType(returnType);
  const hasScalarInReturnType = isScalarType(unwrappedType);
  const isRootQueryField = parentType.name === graphqlSchema.getQueryType()?.name;

  // Special case where auto-resolving can return a collection at the top of
  // the graph, via a root query.
  // When all of these conditions apply:
  // * no result yet
  // * have list return type
  // * is root query field resolver
  // * not resolving for scalars in some way
  // * are resolving for a named type
  //
  // Then: Attempt to look up a collection of models and return those
  if (!result && hasListReturnType && isRootQueryField && !hasScalarInReturnType && isNamedType(unwrappedType)) {
    const unwrappedTypeName = unwrappedType.name;

    const modelName = [unwrappedTypeName]
      .filter(Boolean)
      .find((name) => isValidModelName(mirageServer, name as string));

    if (modelName) {
      const collection = mirageServer?.schema.all(modelName);
      result = collection?.models;
    }
  }

  return result;
};
