import { ResolverWrapper } from '../types';
import { GraphQLResolveInfo } from 'graphql';

export const logWrapper: ResolverWrapper = (originalResolver, wrapperDetails) => {
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

    const [parentOut, argsOut, contextOut, infoOut] = [parent, args, context, info].map((out) =>
      JSON.stringify(out, null, 2),
    );

    console.log('--- resolver start ---');
    console.log('');

    console.log(`Resolver for type: "${typeName}" field: "${fieldName}"`);
    console.log('');
    console.log(`parent:`);
    console.log(parentOut);
    console.log('');
    console.log(`args:`);
    console.log(argsOut);
    console.log('');
    console.log(`context:`);
    console.log(contextOut);
    console.log('');
    console.log('info:');
    console.log(infoOut);
    console.log('');

    const result = await originalResolver(parent, args, context, info);
    const resultOut = JSON.stringify(result, null, 2);

    console.log(`result:`);
    console.log(resultOut);

    console.log('');
    console.log('--- resolver end ---');

    return result;
  };
};
