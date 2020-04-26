import { wrapEach } from '../resolver-map/wrap-each';
import { ResolverMapWrapper } from '../types';

type ResolverStash = {
  parent: any;
  args: any;
  context: any;
  info: any;
  result: any;
};

export const stashKey = Symbol('stash-state');
export const stashFor = (ref: any): ResolverStash | undefined => {
  return ref && ref[stashKey];
};

export const stashStateWrapper: ResolverMapWrapper = wrapEach((originalResolver) => {
  return (parent, args, context, info) => {
    const result = originalResolver(parent, args, context, info);

    if (typeof result === 'object' && result !== null) {
      const stash: ResolverStash = {
        parent,
        args,
        context,
        info,
        result,
      };

      result[stashKey] = stash;
    }

    return result;
  };
});
