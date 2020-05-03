import { wrapEachField } from '../resolver-map/wrap-each-field';
import { ResolverMapWrapper, ResolverWrapper } from '../types';

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

export const stashStateSingular: ResolverWrapper = (originalResolver) => {
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
};

export const stashStateWrapper: ResolverMapWrapper = wrapEachField([stashStateSingular]);
