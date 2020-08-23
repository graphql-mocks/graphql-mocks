import { type } from '../highlight/highlighter/type';
import { field } from '../highlight/highlighter/field';
import { Highlight } from '../highlight/highlight';

export function defaultHighlightCallback(h: Highlight): Highlight {
  return h.include(type(), field());
}
