import { Highlight } from '../highlight/highlight';
import { Reference } from '../highlight/types';

export type highlightCallback = (h: Highlight) => void;

export type CoercibleHighlight = Highlight | Reference[] | highlightCallback;

export interface HighlightableMiddlewareOptions {
  highlight?: Highlight | Reference[] | highlightCallback;
  replace?: boolean;
}
