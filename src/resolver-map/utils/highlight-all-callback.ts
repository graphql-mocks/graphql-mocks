import { Highlight, field, type } from '../../highlight';

export function highlightAllCallback(h: Highlight): Highlight {
  return h.include(type(), field());
}
