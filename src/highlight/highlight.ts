import { GraphQLSchema } from 'graphql';
import clone from 'lodash.clonedeep';
import { include } from './operation/include';
import { exclude } from './operation/exclude';
import { filter } from './operation/filter';
import { ValidationError, validate } from './utils/validate';
import { Highlighter, Reference, ReferencesOperation, ReferenceMap } from './types';
import { convertHighlighterOrReferenceToHighlighter } from './utils/convert-highlighter-or-reference-to-highlighter';
import { buildReferenceMap } from './utils/build-reference-map';
import { unique } from './utils/unique';

export class Highlight {
  schema: GraphQLSchema;
  references: Reference[];
  errors: Error[];

  constructor(schema: GraphQLSchema, references?: Reference[]) {
    this.schema = schema;
    references = references ?? [];
    this.validate(references);
    this.references = references;
    this.errors = [];
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
    this.references = newReferences;
    return this;
  }

  exclude(...highlightersOrReferences: (Highlighter | Reference)[]): Highlight {
    const operation = exclude;
    const highlighters = highlightersOrReferences
      .map(convertHighlighterOrReferenceToHighlighter)
      .filter(Boolean) as Highlighter[];

    const newReferences = this.applyHighlighters(operation, highlighters);
    this.validate(newReferences);
    this.references = newReferences;
    return this;
  }

  filter(...highlightersOrReferences: (Highlighter | Reference)[]): Highlight {
    const operation = filter;
    const highlighters = highlightersOrReferences
      .map(convertHighlighterOrReferenceToHighlighter)
      .filter(Boolean) as Highlighter[];

    const newReferences = this.applyHighlighters(operation, highlighters);
    this.references = newReferences;
    return this;
  }

  check(...highlightersOrReferences: (Highlighter | Reference)[]): Error[] {
    const schema = this.schema;
    const highlighters = highlightersOrReferences
      .map(convertHighlighterOrReferenceToHighlighter)
      .filter(Boolean) as Highlighter[];

    return highlighters
      .reduce((references: Reference[], highlighter: Highlighter) => {
        const highlightedReferences = highlighter.mark(schema);
        return [...references, ...highlightedReferences];
      }, [])
      .map((reference) => validate(this.schema, reference))
      .filter(Boolean) as Error[];
  }

  clone(): Highlight {
    return new Highlight(this.schema, this.references);
  }

  protected applyHighlighters(operation: ReferencesOperation, highlighters: Highlighter[]): Reference[] {
    const schema = this.schema;

    // all changes are implemented with a fresh copy of data
    const references = clone(this.references);

    let updated = highlighters.reduce((references: Reference[], highlighter: Highlighter) => {
      let highlightedReferences;

      try {
        highlightedReferences = highlighter.mark(schema);
      } catch (error) {
        this.errors.push(error);
      } finally {
        highlightedReferences = highlightedReferences || [];
      }

      return operation(references, highlightedReferences);
    }, references);

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

export function h(schema: GraphQLSchema, references?: Reference[]): Highlight {
  return new Highlight(schema, references);
}
