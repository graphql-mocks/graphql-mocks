import { GraphQLSchema } from 'graphql';
import { Reference } from '../types';
import { isTypeReference } from './is-type-reference';
import { isFieldReference } from './is-field-reference';
import { typeForReference } from './type-for-reference';
import { fieldForReference } from './field-for-reference';

export function validate(schema: GraphQLSchema, reference: Reference): Error | null {
  const referenceAsJSON = JSON.stringify(reference);

  if (!isTypeReference(reference) && !isFieldReference(reference)) {
    return new Error(
      `Reference ${referenceAsJSON} is not a valid type reference \`"TypeName"\` or valid field reference \`["TypeName", "fieldName"]\``,
    );
  }

  if (isTypeReference(reference) && !typeForReference(schema, reference)) {
    return new Error(`Type Reference ${referenceAsJSON} could not be found in the GraphQLSchema`);
  }

  if (isFieldReference(reference) && !fieldForReference(schema, reference)) {
    return new Error(`Field Reference ${referenceAsJSON} could not be found in the GraphQLSchema`);
  }

  return null;
}

export class ValidationError extends Error {
  constructor(errors: Error[]) {
    const mapped = errors.map((error) => ` * ${error.message}`).join('\n');
    const message = `References failed validation with errors:\n${mapped}`;
    super(message);
  }
}
