import { Highlighter, Reference } from '../types';
import { isTypeReference } from './is-type-reference';
import { isFieldReference } from './is-field-reference';
import { isHighlighter } from './is-highlighter';
import { reference as referenceHighlighter } from '../highlighters/reference';

export function convertHighlightersOrReferencesToHighlighters(
  highlightersOrReferences: (Highlighter | Reference)[],
): Highlighter[] {
  const highlighters = highlightersOrReferences
    .map((highlighterOrReference) => {
      if (isTypeReference(highlighterOrReference) || isFieldReference(highlighterOrReference)) {
        return referenceHighlighter(highlighterOrReference);
      }

      if (isHighlighter(highlighterOrReference)) {
        return highlighterOrReference;
      }

      return undefined;
    })
    .filter(Boolean) as Highlighter[];

  return highlighters;
}
