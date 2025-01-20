import { GraphQLSchema, isObjectType } from 'graphql';
import { DocumentStore } from '../types';

export function storeTypenamesFromSchema(schema: GraphQLSchema): (keyof DocumentStore)[] {
  const storeTypenames: (keyof DocumentStore)[] = [];

  const typeMap = schema.getTypeMap();
  for (const typeName in typeMap) {
    const type = typeMap[typeName];
    const isInternalType = type.name.startsWith('__');
    const rootTypeNames = [
      schema.getQueryType()?.name,
      schema.getMutationType()?.name,
      schema.getSubscriptionType()?.name,
    ];

    if (isObjectType(type) && !isInternalType && !rootTypeNames.includes(type.name)) {
      storeTypenames.push(type.name);
    }
  }

  return storeTypenames;
}
