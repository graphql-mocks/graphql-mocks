import { FieldResolver, FieldResolverWrapper } from '../types';
import { GraphQLResolveInfo } from 'graphql';

type ResolverStash = {
  parent: unknown;
  args: Record<string, unknown>;
  context: Record<string, unknown>;
  info: GraphQLResolveInfo;
  result: unknown;
};

export const stashKey = Symbol('stash-state');

export function stashFor(ref: {
  [key: string]: unknown;
  [stashKey]: ResolverStash | undefined;
}): ResolverStash | undefined {
  return ref && ref[stashKey];
}

export const stashStateWrapper: FieldResolverWrapper = async function stashStateWrapper(
  originalResolver,
): Promise<FieldResolver> {
  return (parent, args, context, info): unknown => {
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
