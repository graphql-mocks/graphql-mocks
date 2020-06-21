import { AutoResolverErrorMeta, ObjectResolverMatch, RootQueryResolverMatch } from './helpers';

export class AutoResolverError extends Error {
  _message?: string;
  _stack?: string;

  meta: AutoResolverErrorMeta;

  constructor(error: Error, meta: AutoResolverErrorMeta) {
    super();
    this.meta = meta;
    this._message = error.message;
    this._stack = error.stack;
    this.message = this.createMessage();
  }

  createMessage(): string {
    const match = this.meta.match;
    const typeName = this.meta.info.parentType.name;
    const fieldName = this.meta.info.fieldName;
    const usedFieldFilter = Boolean(this.meta.usedFieldFilter);
    const autoResolverType = this.meta.autoResolverType;
    const parentModelName = this.meta.parent?.model;

    // messages
    let matchMessage = '';
    if (autoResolverType === 'OBJECT') {
      const objectMatch = match as ObjectResolverMatch;

      const matchMessages = [
        objectMatch.matchedProperty ? `Matched on: ${objectMatch.matchedProperty}` : null,
        `Field Candidates tried: ${objectMatch.fieldNameCandidates.join(', ')}`,
      ];

      matchMessage = matchMessages.filter(Boolean).join('\n');
    }

    if (autoResolverType === 'ROOT_TYPE') {
      const rootMatch = match as RootQueryResolverMatch;

      const matchMessages = [
        `Tried to lookup models for type ${
          this.meta.info.parentType
        } from the following candidates ${rootMatch.modelNameCandidates.join(',')}`,
        rootMatch.matchedModelName ? `Matched on ${rootMatch.matchedModelName}` : null,
      ];

      matchMessage = matchMessages.filter(Boolean).join('\n');
    }

    const message = [
      `=== Mirage Auto Resolver Error [${autoResolverType}] ===\n`,
      `An error occurred auto resolving ["${typeName}", "${fieldName}"]:`,
      this._message,
      '\n** Additional Info **',
      matchMessage,
      ' ',
      `Used field filter on mirage mapper: ${usedFieldFilter};`,
      `Mirage parent: ${parentModelName ? this.meta.parent.toString() : 'false'}`,
      `Resolve as relay connection: ${this.meta.isRelay}`,
    ]
      .filter(Boolean)
      .join('\n');

    return message;
  }
}
