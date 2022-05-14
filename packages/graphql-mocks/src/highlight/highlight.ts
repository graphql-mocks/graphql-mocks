import { GraphQLSchema } from 'graphql';
import { clone } from 'ramda';
import { include } from './operation/include';
import { exclude } from './operation/exclude';
import { filter } from './operation/filter';
import { ValidationError, validate } from './utils/validate';
import { Highlighter, Reference, ReferencesOperation, ReferenceMap } from './types';
import { convertHighlighterOrReferenceToHighlighter } from './utils/convert-highlighter-or-reference-to-highlighter';
import { buildReferenceMap } from './utils/build-reference-map';
import { unique } from './utils/unique';
import { isFieldReference } from './utils/is-field-reference';
import { isTypeReference } from './utils/is-type-reference';

const INTERNAL_SCALARS = ['Int', 'Float', 'String', 'Boolean', 'ID'];

export class Highlight {
  schema: GraphQLSchema;
  references: Reference[];

  constructor(schema: GraphQLSchema, references?: Reference[]) {
    this.schema = schema;
    references = references ?? [];
    this.validate(references);
    this.references = references;
  }

  get instances(): { types: ReferenceMap } {
    const schema = this.schema;
    const map = buildReferenceMap(schema, this.references);
    return { types: map };
  }

  include(...highlightersOrReferences: (Highlighter | Reference)[]): Highlight {
    const operation = include;
    const highlighters = highlightersOrReferences
      .map(convertHighlighterOrReferenceToHighlighter)
      .filter(Boolean) as Highlighter[];

    const newReferences = this.applyHighlighters(operation, highlighters);
    this.validate(newReferences);
    return this.clone(newReferences);
  }

  exclude(...highlightersOrReferences: (Highlighter | Reference)[]): Highlight {
    const operation = exclude;
    const highlighters = highlightersOrReferences
      .map(convertHighlighterOrReferenceToHighlighter)
      .filter(Boolean) as Highlighter[];

    const newReferences = this.applyHighlighters(operation, highlighters);
    this.validate(newReferences);
    return this.clone(newReferences);
  }

  filter(...highlightersOrReferences: (Highlighter | Reference)[]): Highlight {
    const operation = filter;
    const highlighters = highlightersOrReferences
      .map(convertHighlighterOrReferenceToHighlighter)
      .filter(Boolean) as Highlighter[];

    const newReferences = this.applyHighlighters(operation, highlighters);
    this.validate(newReferences);
    return this.clone(newReferences);
  }

  protected clone(references: Reference[]): Highlight {
    return new Highlight(this.schema, references);
  }

  protected applyHighlighters(operation: ReferencesOperation, highlighters: Highlighter[]): Reference[] {
    const schema = this.schema;

    // all changes are implemented with a fresh copy of data
    const references = clone(this.references);

    let updated = highlighters
      .reduce((references: Reference[], highlighter: Highlighter) => {
        const highlightedReferences = highlighter.mark(schema);
        return operation(references, highlightedReferences);
      }, references)
      .filter(function filterInternalGraphQLTypes(reference) {
        let type;

        if (isFieldReference(reference)) {
          type = reference[0];
        }

        if (isTypeReference(reference)) {
          type = reference;
        }

        if (type) {
          return !type.startsWith('__') && !INTERNAL_SCALARS.includes(type);
        }

        return true;
      });

    updated = unique(updated);
    return updated;
  }

  protected validate(references: Reference[]): void {
    const errors = references.map((reference) => validate(this.schema, reference)).filter(Boolean) as Error[];
    if (errors.length === 0) {
      return;
    }

    throw new ValidationError(errors);
  }
}

export function hi(schema: GraphQLSchema, references?: Reference[]): Highlight {
  return new Highlight(schema, references);
}
