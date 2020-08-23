import {
  FieldResolver,
  TypeResolver,
  TypeWrapperFunction,
  FieldWrapperFunction,
  Wrapper,
  WrapperOptionsBase,
} from '../types';

export async function wrapResolver(
  resolver: TypeResolver | FieldResolver,
  wrappers: (TypeWrapperFunction | FieldWrapperFunction | Wrapper)[],
  wrapperOptions: WrapperOptionsBase,
): Promise<FieldResolver | TypeResolver> {
  wrappers = [...wrappers];
  let wrapper = wrappers.shift();
  wrapper = wrapper && typeof wrapper.wrap === 'function' ? wrapper.wrap : wrapper;

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
