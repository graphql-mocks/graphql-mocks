import { Highlighter } from '../types';

export function isHighlighter(highlighter: unknown): highlighter is Highlighter {
  return (
    typeof highlighter === 'object' &&
    highlighter != null &&
    'mark' in highlighter &&
    typeof (highlighter as Highlighter).mark === 'function'
  );
}
