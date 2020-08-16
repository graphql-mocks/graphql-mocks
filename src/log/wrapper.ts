import { ResolverWrapper } from '../types';
import { GraphQLResolveInfo } from 'graphql';

export const logWrapper: ResolverWrapper = async function logWrapper(originalResolver, wrapperDetails) {
  const { type, field } = wrapperDetails;
  const typeName = type.name;
  const fieldName = field.name;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  return async function (
    parent: any,
    args: Record<string, any>,
    context: Record<string, any> | GraphQLResolveInfo,
    info: any,
  ): Promise<any> {
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const [parentOut, argsOut] = [parent, args].map((out) => {
      try {
        return JSON.stringify(out, null, 2);
      } catch {
        return 'Unable to JSON.stringify';
      }
    });

    console.log(`--- resolver start for ${typeName}.${fieldName}---`);
    console.log('');

    console.log(`parent:`);
    console.log(parentOut);
    console.log('');
    console.log(`args:`);
    console.log(argsOut);
    console.log('');

    const result = await originalResolver(parent, args, context, info);
    const resultOut = JSON.stringify(result, null, 2);

    console.log(`result:`);
    console.log(resultOut);

    console.log('');
    console.log(`--- resolver end for ${typeName}.${fieldName}---`);

    return result;
  };
};
