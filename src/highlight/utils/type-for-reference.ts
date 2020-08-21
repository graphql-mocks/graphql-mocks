export function typeForReference(schema: GraphQLSchema, reference: TypeReference): GraphQLNamedType | undefined {
  return schema.getType(reference) ?? undefined;
}
