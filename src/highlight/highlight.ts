import { GraphQLSchema } from 'graphql';
import clone from 'lodash.clonedeep';
import { include } from './operation/include';
import { exclude } from './operation/exclude';
import { filter } from './operation/filter';
import { ValidationError, validate } from './utils/validate';
import { Highlighter, Reference, ReferencesOperation } from './types';
import { convertHighlightersOrReferencesToHighlighters } from './utils/convert-highlighters-or-references-to-highlighters';

export class Highlight {
  schema: GraphQLSchema;
  references: Reference[];

  constructor(schema: GraphQLSchema, references?: Reference[]) {
    this.schema = schema;
    references = references ?? [];
    this.validate(references);
    this.references = references;
  }

  include(...highlightersOrReferences: (Highlighter | Reference)[]): Highlight {
    const operation = include;
    const highlighters = convertHighlightersOrReferencesToHighlighters(highlightersOrReferences);
    const newReferences = this.applyHighlighters(operation, highlighters);
    return this.new(newReferences);
  }

  exclude(...highlightersOrReferences: (Highlighter | Reference)[]): Highlight {
    const operation = exclude;
    const highlighters = convertHighlightersOrReferencesToHighlighters(highlightersOrReferences);
    const newReferences = this.applyHighlighters(operation, highlighters);
    return this.new(newReferences);
  }

  filter(...highlightersOrReferences: (Highlighter | Reference)[]): Highlight {
    const operation = filter;
    const highlighters = convertHighlightersOrReferencesToHighlighters(highlightersOrReferences);
    const newReferences = this.applyHighlighters(operation, highlighters);
    return this.new(newReferences);
  }

  applyHighlighters(operation: ReferencesOperation, highlighters: Highlighter[]): Reference[] {
    const schema = this.schema;

    // all changes are implemented with a fresh copy of data
    const references = clone(this.references);

    const updated = highlighters.reduce((references: Reference[], highlighter: Highlighter) => {
      const highlighted = highlighter.mark(schema);
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
