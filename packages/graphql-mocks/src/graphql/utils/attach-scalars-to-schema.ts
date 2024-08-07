import { GraphQLSchema, isScalarType } from 'graphql';
import { ScalarMap } from '../../types';
import { isScalarDefinition } from '../type-utils/is-scalar-definition';

export function attachScalarsToSchema(schema: GraphQLSchema, scalarMap: ScalarMap): void {
  const scalarTypeMap = schema.getTypeMap();

  for (const scalarTypeKey in scalarTypeMap) {
    const scalarType = scalarTypeMap[scalarTypeKey];
    if (!isScalarType(scalarType)) {
      return;
    }

    const scalarDefinition = scalarMap[scalarType.name];
    if (!isScalarDefinition(scalarDefinition)) {
      return;
    }

    // copy over keys from scalar defintion
    for (const key in scalarDefinition) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (scalarType as any)[key] = (scalarDefinition as any)[key];
    }
  }
}
