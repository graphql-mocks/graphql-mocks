import { Highlight } from '../highlight/highlight';
import { Reference } from '../highlight/types';
import { Wrapper } from '../types';

export type HighlightCallback = (h: Highlight) => Highlight;

export interface ReplaceableResolverOption {
  replace?: boolean;
}

export interface HighlightableOption {
  highlight?: Highlight | Reference[] | HighlightCallback;
}

export interface WrappableOption {
  wrappers?: Wrapper[];
}
