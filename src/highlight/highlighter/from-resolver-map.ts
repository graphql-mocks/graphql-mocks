import { Highlighter, Reference, HighlighterFactory, TypeReference } from '../types';
import { ResolverMap } from '../../types';
import { FieldReference } from '../../../lib/resolver-map/reference/field-reference';

class FromResolverMapHighlighter implements Highlighter {
  resolverMap: ResolverMap;

  constructor(resolverMap: ResolverMap) {
    if (typeof resolverMap !== 'object') {
      throw new Error(`Pass a resolver map for the fromResolverMap highlighter, got typeof ${resolverMap}`);
    }

    this.resolverMap = resolverMap;
  }

  mark(): Reference[] {
    const references: Reference[] = [];
    const resolverMap = this.resolverMap;

    for (const typeName in resolverMap) {
      references.push(typeName as TypeReference);

      for (const fieldName in resolverMap[typeName]) {
        if (fieldName === '__resolveType') continue;
        references.push([typeName, fieldName] as FieldReference);
      }
    }

    return references;
  }
}

export const fromResolverMap: HighlighterFactory = function fromResolverMap(resolverMap: ResolverMap) {
  return new FromResolverMapHighlighter(resolverMap);
};
