import { ResolverContext, FieldResolver, TypeResolver } from '../types';
import { defaultPackOptions } from './pack';
import { PackOptions } from './types';
import { createWrapper, WrapperFor } from '../resolver/create-wrapper';
import { isObjectType, isAbstractType } from 'graphql';

export function normalizePackOptions(packOptions: Partial<PackOptions> = defaultPackOptions): PackOptions {
  const normalized = {
    ...defaultPackOptions,

    dependencies: packOptions.dependencies ?? defaultPackOptions.dependencies,
    state: packOptions.state ?? defaultPackOptions.state,
  };

  return normalized;
}

export function embedPackOptionsInContext(context: Record<string, unknown>, packOptions: PackOptions): ResolverContext {
  context = context ?? {};
  context = {
    ...context,
    pack: context.pack || packOptions,
  };

  return context;
}

export const embedPackOptions = createWrapper(
  'embed-pack-options',
  WrapperFor.ANY,
  async (resolver, options): Promise<TypeResolver | FieldResolver> => {
    const { type } = options;

    if (isObjectType(type)) {
      const fieldResolver: FieldResolver = (parent, args, context, info) => {
        context = embedPackOptionsInContext(context, options.packOptions);
        return (resolver as FieldResolver)(parent, args, context, info);
      };

      return fieldResolver;
    }

    if (isAbstractType(type)) {
      const typeResolver: TypeResolver = (value, context, info, abstractType) => {
        context = embedPackOptionsInContext(context, options.packOptions);
        return (resolver as TypeResolver)(value, context, info, abstractType);
      };

      return typeResolver;
    }

    return resolver;
  },
);
