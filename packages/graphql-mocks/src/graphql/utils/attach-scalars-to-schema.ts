import { GraphQLScalarType, GraphQLSchema, isScalarType } from 'graphql';
import { ScalarMap } from '../../types';
import { isScalarDefinition } from '../type-utils/is-scalar-definition';

export function attachScalarsToSchema(schema: GraphQLSchema, scalarMap: ScalarMap): void {
  const scalarTypesArray = Object.values(schema.getTypeMap()).filter(isScalarType);
  const scalarTypeMap: Record<string, GraphQLScalarType> = scalarTypesArray.reduce((map, scalar) => {
    return {
      ...map,
      [scalar.name]: scalar,
    };
  }, {});
  const resolverMapScalars = Object.keys(scalarMap).filter((type) => Object.keys(scalarTypeMap).includes(type));

  for (const scalarName of resolverMapScalars) {
    const possibleScalar = scalarMap[scalarName];

    if (!isScalarDefinition(possibleScalar)) {
      continue;
    }

    const scalarDefinition = possibleScalar;
    const schemaScalar = scalarTypeMap[scalarName];

    for (const key in scalarDefinition) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (schemaScalar as any)[key] = (scalarDefinition as any)[key];
    }
  }
}
