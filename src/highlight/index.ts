import { GraphQLSchema, GraphQLInputField, GraphQLNamedType, GraphQLField } from 'graphql';
import differenceWith from 'lodash.differencewith';
import clone from 'lodash.clonedeep';

type Reference = TypeReference | FieldReference;
type FieldReference = [string, string];
type TypeReference = string;

function isTypeReference(reference: Reference): reference is TypeReference {
  return typeof reference === 'string';
}

function isFieldReference(reference: Reference): reference is FieldReference {
  return (
    Array.isArray(reference) &&
    reference.length === 2 &&
    typeof reference[0] === 'string' &&
    typeof reference[1] === 'string'
  );
}

function typeForReference(schema: GraphQLSchema, reference: TypeReference): GraphQLNamedType | undefined {
  return schema.getType(reference) ?? undefined;
}

function fieldForReference(
  schema: GraphQLSchema,
  reference: FieldReference,
): GraphQLField<unknown, unknown> | GraphQLInputField | undefined {
  const [typeName, fieldName] = reference;
  const type = schema.getType(typeName);

  if (type && 'getFields' in type) {
    const fields = type.getFields();
    return fields[fieldName];
  }

  return undefined;
}

interface Highlighter {
  (schema: GraphQLSchema, highlighted: Reference[]): Reference[];
}

interface HighlighterFactory {
  (...options: unknown[]): Highlighter;
}

interface ReferencesOperation {
  (source: Reference[], change: Reference[]): Reference[];
}

export function equal(a: Reference, b: Reference): boolean {
  return a === b || (Array.isArray(a) && Array.isArray(b) && a[0] === b[0] && a[1] === b[1]);
}

export function include(source: Reference[], update: Reference[]): Reference[] {
  return [...source, ...update];
}

export function exclude(source: Reference[], update: Reference[]): Reference[] {
  return differenceWith(source, update, equal);
}

export function filter(source: Reference[], update: Reference[]): Reference[] {
  return source.filter((reference) => {
    return Boolean(update.find((updateRef) => equal(updateRef, reference)));
  });
}

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

class ValidationError extends Error {
  constructor(errors: Error[]) {
    const mapped = errors.map((error) => ` * ${error.message}`).join('\n');
    const message = `References failed validation with errors:\n${mapped}`;
    super(message);
  }
}

export class Highlight {
  schema: GraphQLSchema;
  references: Reference[];

  constructor(schema: GraphQLSchema, references?: Reference[]) {
    this.schema = schema;
    references = references ?? [];
    this.validate(references);
    this.references = references;
  }

  include(...highlighters: Highlighter[]): Highlight {
    const operation = include;
    const newReferences = this.applyHighlighters(operation, highlighters);
    return this.new(newReferences);
  }

  exclude(...highlighters: Highlighter[]): Highlight {
    const operation = exclude;
    const newReferences = this.applyHighlighters(operation, highlighters);
    return this.new(newReferences);
  }

  filter(...highlighters: Highlighter[]): Highlight {
    const operation = filter;
    const newReferences = this.applyHighlighters(operation, highlighters);
    return this.new(newReferences);
  }

  applyHighlighters(operation: ReferencesOperation, highlighters: Highlighter[]): Reference[] {
    const schema = this.schema;

    // all changes are implemented with a fresh copy of data
    const references = clone(this.references);

    const updated = highlighters.reduce((references: Reference[], highlighter: Highlighter) => {
      const highlighted = highlighter(schema, references);
      return operation(references, highlighted);
    }, references);

    this.validate(updated);
    return updated;
  }

  validate(references: Reference[]): void {
    const errors = references.map((reference) => validate(this.schema, reference)).filter(Boolean) as Error[];
    if (errors.length === 0) {
      return;
    }

    throw new ValidationError(errors);
  }

  new(references: Reference[]): Highlight {
    return new Highlight(this.schema, references);
  }
}
