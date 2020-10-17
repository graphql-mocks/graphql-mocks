import { createWrapper, WrapperFor } from '../../resolver';
import { isFieldResolver, isTypeResolver } from '../../resolver/utils';
import { FieldResolver, TypeResolver } from '../../types';
import { embedPackOptionsInContext } from './embed-pack-options-in-context';

export const embedPackOptionsWrapper = createWrapper(
  'embed-pack-options',
  WrapperFor.ANY,
  async (resolver, options) => {
    const { type } = options;

    if (isFieldResolver(type, resolver)) {
      const fieldResolver: FieldResolver = (parent, args, context, info) => {
        context = embedPackOptionsInContext(context, options.packOptions);
        return resolver(parent, args, context, info);
      };

      return fieldResolver;
    }

    if (isTypeResolver(type, resolver)) {
      const typeResolver: TypeResolver = (value, context, info, abstractType) => {
        context = embedPackOptionsInContext(context, options.packOptions);
        return (resolver as TypeResolver)(value, context, info, abstractType);
      };

      return typeResolver;
    }

    return resolver;
  },
);
