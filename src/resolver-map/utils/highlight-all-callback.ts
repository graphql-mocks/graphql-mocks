import { Highlight } from '../../highlight/highlight';
import { field } from '../../highlight/highlighter/field';
import { type } from '../../highlight/highlighter/type';

export function highlightAllCallback(h: Highlight): Highlight {
  return h.include(type(), field());
}
