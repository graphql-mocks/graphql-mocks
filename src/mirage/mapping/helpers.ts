export type GraphQLMirageMapping = {
  mirage: { modelName: string; attrName: string };
  graphql: { typeName: string; fieldName: string };
};

export const mirageMappingFor = (typeName: string, fieldName: string, mappings: GraphQLMirageMapping[]) => {
  const match = mappings.find(mapping => {
    return typeName === mapping.graphql.typeName && fieldName === mapping.graphql.fieldName;
  });

  return match?.mirage;
};
