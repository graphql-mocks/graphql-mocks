import { Highlighter, Reference } from '../types';
import { isTypeReference } from './is-type-reference';
import { isFieldReference } from './is-field-reference';
import { isHighlighter } from './is-highlighter';
import { reference as referenceHighlighter } from '../highlighter/reference';

export function convertHighlighterOrReferenceToHighlighter(
  highlighterOrReference: Highlighter | Reference,
): Highlighter | undefined {
  if (isHighlighter(highlighterOrReference)) {
    return highlighterOrReference;
  }

  if (isTypeReference(highlighterOrReference) || isFieldReference(highlighterOrReference)) {
    return referenceHighlighter(highlighterOrReference);
  }

  return undefined;
}
