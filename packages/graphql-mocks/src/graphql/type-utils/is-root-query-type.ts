import { GraphQLSchema, GraphQLType } from 'graphql';

export function isRootQueryType(schema: GraphQLSchema, type: GraphQLType | string): boolean {
  if (typeof type !== 'string' && !('name' in type)) {
    return false;
  }

  const rootQueryTypeName = schema.getQueryType()?.name;
  const typeName = typeof type === 'string' ? type : type.name;
  return typeName === rootQueryTypeName;
}
