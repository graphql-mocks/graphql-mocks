import { GraphQLSchema, isObjectType } from 'graphql';
import { typeExists } from '../graphql/type-exists';
import { TypeDoesNotExist } from './errors/type-does-not-exist';
import { TypeIsNotDocumentCompatible } from './errors/type-is-not-document-compatible';
import { DocumentStore, Document, DocumentTypeValidator, FieldValidator } from '../types';
import { validateField } from './validate-field';
import { isNullDocument } from '../document/null-document';

export function validate(
  graphqlSchema: GraphQLSchema,
  document: Document,
  store: DocumentStore,
  validators: { document: DocumentTypeValidator[]; field: FieldValidator[] },
): void {
  if (isNullDocument(document)) {
    return;
  }

  const typeName = document.__typename;
  const type = graphqlSchema.getType(typeName);

  if (!type) {
    throw new Error(`Type ${typeName} does not exist in the graphql schema.`);
  }

  if (!isObjectType(type)) {
    throw new TypeIsNotDocumentCompatible({ type });
  }

  if (!typeExists(graphqlSchema, typeName)) {
    throw new TypeDoesNotExist({ typename: typeName });
  }

  const combinedValidators: DocumentTypeValidator[] = [...validators.document, validateField(validators.field)];
  combinedValidators.forEach((validator) => validator.validate({ store, graphqlSchema, document, type }));
}
