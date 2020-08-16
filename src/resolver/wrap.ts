import { Resolver, ResolverWrapper, ResolverWrapperOptions } from '../types';

export async function wrapResolver(
  resolver: Resolver,
  wrappers: ResolverWrapper[],
  wrapperOptions: ResolverWrapperOptions,
): Promise<Resolver> {
  wrappers = [...wrappers];
  const wrapper = wrappers.shift();

  if (!wrapper) {
    return resolver;
  }

  const wrappedResolver = await wrapper(resolver, wrapperOptions);

  if (typeof wrappedResolver !== 'function') {
    throw new Error(
      `Wrapper: ${wrapper.toString()}\n\nThis wrapper did not return a function, got ${typeof wrappedResolver}.`,
    );
  }

  return wrapResolver(wrappedResolver, wrappers, wrapperOptions);
}
