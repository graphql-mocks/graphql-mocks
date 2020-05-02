import { Resolver, ResolverWrapper, ResolverWrapperOptions } from '../types';

export const wrapResolver = (
  resolver: Resolver,
  wrappers: ResolverWrapper[],
  wrapperOptions: ResolverWrapperOptions,
): Resolver => {
  const wrapper = wrappers.shift();

  if (!wrapper) {
    return resolver;
  }

  return wrapResolver(wrapper(resolver, wrapperOptions), wrappers, wrapperOptions);
};
