import { GraphQLSchema, GraphQLType } from 'graphql';

export function isRootMutationType(schema: GraphQLSchema, type: GraphQLType | string): boolean {
  if (typeof type !== 'string' && !('name' in type)) {
    return false;
  }

  const rootQueryTypeName = schema.getMutationType()?.name;
  const typeName = typeof type === 'string' ? type : type.name;
  return typeName === rootQueryTypeName;
}
