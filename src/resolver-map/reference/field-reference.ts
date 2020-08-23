// import { ResolverMap } from '../../types';

// export type TypeName = string;
// export type FieldName = string;
// export type FieldReference = [TypeName, FieldName];

// export function difference(initialSet: FieldReference[], excludedSet: FieldReference[]): FieldReference[] {
//   const result: FieldReference[] = [];

//   initialSet.forEach(([typeName, fieldName]) => {
//     const excluded = excludedSet.find(
//       ([excludedTypeName, excludedFieldName]) => typeName === excludedTypeName && fieldName === excludedFieldName,
//     );

//     if (!excluded) {
//       result.push([typeName, fieldName]);
//     }
//   });

//   return result;
// }

// export function fieldExistsInResolverMap(resolverMap: ResolverMap, fieldReference: FieldReference): boolean {
//   if (!fieldReference || !Array.isArray(fieldReference) || fieldReference.length !== 2) {
//     return false;
//   }

//   const [typeName, fieldName] = fieldReference;
//   return Boolean(resolverMap?.[typeName]?.[fieldName]);
// }
