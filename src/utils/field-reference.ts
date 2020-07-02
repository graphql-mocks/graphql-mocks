import { FieldReference, ResolverMap } from '../types';

export function unique(fieldReferences: FieldReference[]): FieldReference[] {
  const unique: FieldReference[] = [];

  fieldReferences.forEach(([typeName, fieldName]) => {
    const match = unique.find(
      ([uniqueTypeName, uniqueFieldName]) => typeName === uniqueTypeName && fieldName === uniqueFieldName,
    );

    if (!match) unique.push([typeName, fieldName]);
  });

  return unique;
}

export function difference(initialSet: FieldReference[], excludedSet: FieldReference[]): FieldReference[] {
  const result: FieldReference[] = [];

  initialSet.forEach(([typeName, fieldName]) => {
    const excluded = excludedSet.find(
      ([excludedTypeName, excludedFieldName]) => typeName === excludedTypeName && fieldName === excludedFieldName,
    );

    if (!excluded) {
      result.push([typeName, fieldName]);
    }
  });

  return result;
}

export function fieldReferenceInResolverMap(fieldReference: FieldReference, resolverMap: ResolverMap): boolean {
  if (!fieldReference || !Array.isArray(fieldReference) || fieldReference.length !== 2) {
    return false;
  }

  const [typeName, fieldName] = fieldReference;
  return Boolean(resolverMap?.[typeName]?.[fieldName]);
}
