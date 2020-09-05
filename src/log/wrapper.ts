import { createWrapper } from '../resolver';
import { WrapperFor } from '../resolver/constants';
import { FieldResolver, TypeResolver } from '../types';
import { isFieldResolver, isTypeResolver } from '../resolver/utils';

export const logWrapper = createWrapper('log-wrapper', WrapperFor.ANY, async function (originalResolver, options) {
  const { type, field } = options;

  if (isFieldResolver(options.type, originalResolver)) {
    const resolver: FieldResolver = async function (parent, args, context, info): Promise<unknown> {
      const [parentOut, argsOut] = [parent, args].map((out) => {
        try {
          return JSON.stringify(out, null, 2);
        } catch {
          return 'Unable to JSON.stringify';
        }
      });

      console.log(`--- START: field resolver on ${type.name}.${field?.name} ---`);
      console.log('');

      console.log(`parent:`);
      console.log(parentOut);
      console.log('');
      console.log('args:');
      console.log(argsOut);
      console.log('');

      const result = await (originalResolver as FieldResolver)(parent, args, context, info);
      const resultOut = JSON.stringify(result, null, 2);

      console.log('result:');
      console.log(resultOut);

      console.log('');
      console.log(`--- END: field resolver on ${type.name}.${field?.name} ---`);

      return result;
    };

    return resolver;
  }

  if (isTypeResolver(options.type, originalResolver)) {
    const resolver: TypeResolver = async (value, context, info, abstractType) => {
      const [valueOut] = [value].map((out) => {
        try {
          return JSON.stringify(out, null, 2);
        } catch {
          return 'Unable to JSON.stringify';
        }
      });

      console.log(`--- START: type resolver on ${type.name} ---`);
      console.log('');

      console.log('value:');
      console.log(valueOut);
      console.log('');

      const result = await (originalResolver as TypeResolver)(value, context, info, abstractType);
      const resultOut = JSON.stringify(result, null, 2);

      console.log('result:');
      console.log(resultOut);

      console.log('');
      console.log(`--- END: type resolver on ${type.name} ---`);

      return result;
    };

    return resolver;
  }

  return originalResolver;
});
