import { GraphQLType, isListType, isNonNullType } from 'graphql';

export function listItemType(type: GraphQLType): GraphQLType {
  if (isNonNullType(type)) {
    return listItemType(type.ofType);
  }

  if (!isListType(type)) {
    throw new Error(`Tried to get list item type but ${type.name} is not a list`);
  }

  return type?.ofType;
}
