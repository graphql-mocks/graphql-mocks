import { GraphQLSchema, isScalarType } from 'graphql';
import { ScalarMap } from '../../types';
import { isScalarDefinition } from '../type-utils/is-scalar-definition';

export function attachScalarsToSchema(schema: GraphQLSchema, scalarMap: ScalarMap): void {
  Object.values(schema.getTypeMap())
    .filter(isScalarType)
    .forEach((scalarType) => {
      const scalarDefinition = scalarMap[scalarType.name];
      if (!isScalarDefinition(scalarDefinition)) {
        return;
      }

      for (const key in scalarDefinition) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (scalarType as any)[key] = (scalarDefinition as any)[key];
      }
    });
}
