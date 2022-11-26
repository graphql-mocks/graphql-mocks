import { GraphQLScalarType, isScalarType } from 'graphql';
import { BasicScalarDefinition } from '../../types';

export function isScalarDefinition(
  possibleScalarDefinition: unknown,
): possibleScalarDefinition is GraphQLScalarType | BasicScalarDefinition {
  if (typeof possibleScalarDefinition !== 'object') {
    return false;
  }

  const hasRequiredScalarDefinitionProperties =
    possibleScalarDefinition &&
    'parseValue' in possibleScalarDefinition &&
    'parseLiteral' in possibleScalarDefinition &&
    'serialize' in possibleScalarDefinition;
  return isScalarType(possibleScalarDefinition) || Boolean(hasRequiredScalarDefinitionProperties);
}
