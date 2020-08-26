import { Highlight } from '../highlight/highlight';
import { Reference } from '../highlight/types';

export type highlightCallback = (h: Highlight) => void;

export interface HighlightableMiddlewareOptions {
  highlight?: Highlight | Reference[] | highlightCallback;
  replace?: boolean;
}
