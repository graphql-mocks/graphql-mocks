import { FieldResolver, TypeResolver } from '../types';
import { isObjectType, isAbstractType } from 'graphql';
import { Wrapper, NamedWrapper, BaseWrapperOptions, GenericWrapperFunction, WrapperForOptions } from './types';
import { WrapperFor } from './constants';

function isNamedWrapper<T extends WrapperForOptions>(wrapper: Wrapper): wrapper is NamedWrapper<T> {
  return wrapper && 'name' in wrapper && 'wrap' in wrapper;
}

export async function applyWrappers<K extends TypeResolver | FieldResolver>(
  resolver: K,
  wrappers: Wrapper[],
  wrapperOptions: BaseWrapperOptions,
): Promise<K> {
  wrappers = [...wrappers];
  let wrapper = wrappers.shift();

  if (typeof resolver !== 'function') {
    throw new Error(`Resolver for wrapResolver must be a function, got ${typeof resolver}`);
  }

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
  const wrappedResolver = await (wrapper as GenericWrapperFunction)(resolver as any, wrapperOptions as any);

  if (typeof wrappedResolver !== 'function') {
    throw new Error(
      `Wrapper "${wrapperName}" was not a function or did not have a wrap method, got ${typeof wrappedResolver}.`,
    );
  }

  return applyWrappers(wrappedResolver, wrappers, wrapperOptions) as Promise<K>;
}
