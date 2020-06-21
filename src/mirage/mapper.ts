import { Resolver, TypeName, FieldReference } from '../types';

export type ModelName = string;
export type AttrName = string;
export type MirageAttrReference = [ModelName, AttrName];

export type TypeMap = {
  graphql: TypeName;
  mirage: ModelName;
};

export type FieldMap = {
  graphql: FieldReference;
  mirage: MirageAttrReference;
};

export type FieldFilterResolver = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  results: any[],
  parent: Parameters<Resolver>[0],
  args: Parameters<Resolver>[1],
  context: Parameters<Resolver>[2],
  info: Parameters<Resolver>[3],
) => any; // eslint-disable-line @typescript-eslint/no-explicit-any

export type FieldFilterMap = {
  graphql: FieldReference;
  filter: FieldFilterResolver;
};

function assertValidTupleDef(def: unknown): void {
  if (!Array.isArray(def)) {
    throw new TypeError(
      `Definition given must be a valid FieldReference (ie: ['typeName', 'fieldName']) or a valid MirageAttrReference(ie: ['modelName', 'attrName'])`,
    );
  }

  const hasStringValues = def.every((value: unknown) => typeof value === 'string');
  if (!hasStringValues) {
    throw new TypeError(`Each value in array definition must be a string`);
  }

  if (def.length !== 2) {
    throw new TypeError(`Definition must contain two strings, got a length of ${def.length}`);
  }
}

export class MirageGraphQLMapper {
  readonly typeMappings: TypeMap[] = [];
  readonly fieldMappings: FieldMap[] = [];
  readonly fieldFilterMappings: FieldFilterMap[] = [];

  addTypeMapping(typeName: TypeName, modelName: ModelName): MirageGraphQLMapper {
    if (typeof typeName !== 'string') {
      throw new TypeError(`First argument must be a string representing the GraphQL type name, got ${typeof typeName}`);
    }

    if (typeof modelName !== 'string') {
      throw new TypeError(
        `Second argument must be a string representing the Mirage model name, got ${typeof modelName}`,
      );
    }

    this.typeMappings.push({ graphql: typeName, mirage: modelName });

    return this;
  }

  addFieldMapping(graphqlDef: FieldReference, mirageDef: MirageAttrReference): MirageGraphQLMapper {
    try {
      assertValidTupleDef(graphqlDef);
    } catch (error) {
      throw new Error(`Unable to use first argument GraphQL Definition: ${error.message}`);
    }

    try {
      assertValidTupleDef(mirageDef);
    } catch (error) {
      throw new Error(`Unable to use second argument Mirage Definition: ${error.message}`);
    }

    this.fieldMappings.push({ graphql: graphqlDef, mirage: mirageDef });

    return this;
  }

  addFieldFilter(graphqlDef: FieldReference, filter: FieldFilterResolver): MirageGraphQLMapper {
    assertValidTupleDef(graphqlDef);

    if (typeof filter !== 'function') {
      throw new Error(`Second argument, filterBy, must be a function, got ${typeof filter}`);
    }

    this.fieldFilterMappings.push({ graphql: graphqlDef, filter });

    return this;
  }

  findMatchForModel(modelNameToMatch: string): TypeName | undefined {
    const mappings = this.typeMappings;

    const match = mappings.find(({ mirage: modelName }) => {
      return modelName === modelNameToMatch;
    });

    return match?.graphql;
  }

  findMatchForAttr(mirageDef: MirageAttrReference): FieldReference | undefined {
    assertValidTupleDef(mirageDef);
    const mappings = this.fieldMappings;

    const match = mappings.find(({ mirage: [modelName, attrName] }) => {
      return modelName === mirageDef[0] && attrName === mirageDef[1];
    });

    return match?.graphql;
  }

  findMatchForType(typeNameToMatch: string): ModelName | undefined {
    const mappings = this.typeMappings;

    const match = mappings.find(({ graphql: typeName }) => {
      return typeName === typeNameToMatch;
    });

    return match?.mirage;
  }

  findMatchForField(graphqlDef: FieldReference): MirageAttrReference | undefined {
    assertValidTupleDef(graphqlDef);
    const mappings = this.fieldMappings;

    const match = mappings.find(({ graphql: [typeName, fieldName] }) => {
      return typeName === graphqlDef[0] && fieldName === graphqlDef[1];
    });

    return match?.mirage;
  }

  findFieldFilter(graphqlDef: FieldReference): FieldFilterResolver | undefined {
    assertValidTupleDef(graphqlDef);
    const mappings = this.fieldFilterMappings;

    const match = mappings.find(({ graphql: [typeName, fieldName] }) => {
      return typeName === graphqlDef[0] && fieldName === graphqlDef[1];
    });

    return match?.filter;
  }
}
