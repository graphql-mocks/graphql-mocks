import { embed } from 'graphql-mocks';
import { CoercibleHighlight } from 'graphql-mocks/highlight/types';
import { ResolverMapMiddleware } from 'graphql-mocks/types';
import { spyWrapper } from './spy-wrapper';

export function spyMiddleware(h: CoercibleHighlight): ResolverMapMiddleware {
  return embed({
    highlight: h,
    wrappers: [spyWrapper],
  });
}
