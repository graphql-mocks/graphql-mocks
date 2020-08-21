import { GraphQLSchema } from 'graphql';
import clone from 'lodash.clonedeep';
import { include } from './operations/include';
import { exclude } from './operations/exclude';
import { filter } from './operations/filter';
import { ValidationError, validate } from './utils/validate';

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
