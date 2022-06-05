import { TypeResolver } from 'graphql-mocks/types';
import { extractDependencies } from 'graphql-mocks/resolver';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import * as falso from '@ngneat/falso';

export function falsoTypeResolver(): TypeResolver {
  return function (value, context, _info, abstractType) {
    const { graphqlSchema } = extractDependencies<{ graphqlSchema: GraphQLSchema }>(context, ['graphqlSchema']);

    if (value?.__typename) {
      return value.__typename;
    }

    const possibleTypes = graphqlSchema.getPossibleTypes(abstractType) as GraphQLObjectType[];
    const chosenType = falso.rand(possibleTypes);
    return chosenType.name;
  };
}
