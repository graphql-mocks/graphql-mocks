import { GraphQLSchema, isScalarType } from 'graphql';
import { ScalarMap } from '../../types';
import { isScalarDefinition } from '../type-utils/is-scalar-definition';

export function attachScalarsToSchema(schema: GraphQLSchema, scalarMap: ScalarMap): void {
  for (const scalarTypeName in scalarMap) {
    const scalarType = schema.getType(scalarTypeName);

    if (!scalarType) {
      throw new Error(
        `Could not find any type named "${scalarTypeName}". Double-check the scalar map where "${scalarTypeName}" is referenced against scalars defined in the graphql schema.`,
      );
    }

    if (!isScalarType(scalarType)) {
      throw new Error(
        `Could not find a scalar type of "${scalarTypeName}". Double-check the scalar map where "${scalarTypeName}" is referenced against scalars defined in the graphql schema.`,
      );
    }

    const scalarDefinition = scalarMap[scalarTypeName];
    if (!isScalarDefinition(scalarDefinition)) {
      throw new Error(`Passed a scalar map with ${scalarTypeName} but it is not a proper scalar definition`);
    }

    // copy over keys from scalar defintion on to scalary instance
    for (const key in scalarDefinition) {
      if (key === 'name') {
        continue;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (scalarType as any)[key] = (scalarDefinition as any)[key];
    }
  }
}
