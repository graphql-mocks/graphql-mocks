export type GraphQLMirageMapping = {
  graphql: MappingDefinition;
  mirage: MappingDefinition;
};

export type MappingDefinition = [string] | [string, string];
export type EmptyMappingDefinition = [undefined] | [undefined, undefined];

export class MirageGraphQLMapper {
  readonly mappings: GraphQLMirageMapping[] = [];

  add(graphql: MappingDefinition, mirage: MappingDefinition): MirageGraphQLMapper {
    if (graphql.length !== mirage.length || (graphql.length !== 1 && graphql.length !== 2)) {
      throw new Error('Mappings must mirror each other, [Type, field] <=> [Model, attr] or [Type] <=> [Model]');
    }

    this.mappings.push({ graphql, mirage });
    return this;
  }

  matchForMirage([modelToMatch, attrToMatch]: MappingDefinition): MappingDefinition | EmptyMappingDefinition {
    const mappings = this.mappings;

    const match = mappings.find(({ mirage: [model, attr] }) => {
      const matchingModel = model === modelToMatch;
      const matchingAttr = attr ? attr === attrToMatch : true;

      return matchingModel && matchingAttr;
    });

    if (!match) {
      return attrToMatch ? [undefined, undefined] : [undefined];
    }

    return match.graphql;
  }

  matchForGraphQL([typeToMatch, fieldToMatch]: MappingDefinition): MappingDefinition | EmptyMappingDefinition {
    const mappings = this.mappings;

    const match = mappings.find(({ graphql: [type, field] }) => {
      const matchingType = type === typeToMatch;
      const matchingField = field ? field === fieldToMatch : true;

      return matchingType && matchingField;
    });

    if (!match) {
      return fieldToMatch ? [undefined, undefined] : [undefined];
    }

    return match.mirage;
  }
}
