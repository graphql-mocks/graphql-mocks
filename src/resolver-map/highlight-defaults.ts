import { type } from '../highlight/highlighter/type';
import { field } from '../highlight/highlighter/field';
import { Highlight } from '../highlight/highlight';
import { HighlightableMiddlewareOptions } from './types';

export function defaultHighlightCallback(h: Highlight): Highlight {
  return h.include(type(), field());
}

export const defaultHighlightableOptions: HighlightableMiddlewareOptions = {
  highlight: defaultHighlightCallback,
  replace: false,
};
