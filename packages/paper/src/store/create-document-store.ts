import { GraphQLSchema, isObjectType } from 'graphql';
import { DocumentStore, SchemaTypes } from '../types';

export function createDocumentStore<T extends SchemaTypes = SchemaTypes>(schema: GraphQLSchema): DocumentStore<T> {
  const store: DocumentStore = {};

  if (!schema) {
    throw new Error('A GraphQLSchema is a required argument');
  }

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
      store[type.name] = [];
    }
  }

  return store as DocumentStore<T>;
}
