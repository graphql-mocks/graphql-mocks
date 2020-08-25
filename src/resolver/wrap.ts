import { FieldResolver, TypeResolver, WrapperOptionsBase, NamedWrapper, Wrapper, WrapperFor } from '../types';
import { isObjectType, isAbstractType } from 'graphql';

function isNamedWrapper(wrapper: Wrapper): wrapper is NamedWrapper {
  return wrapper && 'name' in wrapper && 'wrap' in wrapper;
}

export async function wrapResolver(
  resolver: TypeResolver | FieldResolver,
  wrappers: Wrapper[],
  wrapperOptions: WrapperOptionsBase,
): Promise<FieldResolver | TypeResolver> {
  wrappers = [...wrappers];
  let wrapper = wrappers.shift();

  if (!wrapper) {
    return resolver;
  }

  let wrapperName = wrapper.name || 'UNNAMED';

  if (isNamedWrapper(wrapper)) {
    const namedWrapper = wrapper;
    wrapperName = namedWrapper.name;
    const wrapperFor = namedWrapper.wrapperFor;

    if (wrapperFor === WrapperFor.FIELD && !isObjectType(wrapperOptions.type)) {
      throw new Error(
        `Wrapper "${wrapperName}" is for FIELD resolvers and can't wrap ["${wrapperOptions.type.name}", "${wrapperOptions.field?.name}"].`,
      );
    }

    if (wrapperFor === WrapperFor.TYPE && !isAbstractType(wrapperOptions.type)) {
      throw new Error(`Wrapper "${wrapperName}" is for TYPE resolvers and can't wrap ["${wrapperOptions.type.name}"].`);
    }

    wrapper = wrapper.wrap.bind(wrapper);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wrappedResolver = await wrapper(resolver as any, wrapperOptions);

  if (typeof wrappedResolver !== 'function') {
    throw new Error(
      `Wrapper "${wrapperName}" was not a function or did not have a wrap method, got ${typeof wrappedResolver}.`,
    );
  }

  return wrapResolver(wrappedResolver, wrappers, wrapperOptions);
}
