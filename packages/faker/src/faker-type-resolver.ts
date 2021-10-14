import { TypeResolver } from 'graphql-mocks/types';
import { extractDependencies } from 'graphql-mocks/resolver';
import { GraphQLSchema } from 'graphql';
import faker from 'faker';

export function fakerTypeResolver(): TypeResolver {
  return function (value, context, _info, abstractType) {
    const { graphqlSchema } = extractDependencies<{ graphqlSchema: GraphQLSchema }>(context, ['graphqlSchema']);

    if (value?.__typename) {
      return value.__typename;
    }

    const possibleTypes = graphqlSchema.getPossibleTypes(abstractType);
    const chosenType = faker.random.arrayElement(possibleTypes);
    return chosenType.name;
  };
}
