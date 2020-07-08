import { TypeName, FieldReference } from '../../resolver-map/reference/field-reference';
import { FieldMap, FieldFilterMap, ModelName, MirageAttrReference, FieldFilterResolver, TypeMap } from '../types';
import { assertValidTupleDef } from './utils';

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
