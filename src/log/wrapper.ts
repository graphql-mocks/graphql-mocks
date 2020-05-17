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
    console.log(`Resolver for type: "${typeName}" field: "${fieldName}"`);
    console.log(`parent: ${JSON.stringify(parent)}`);
    console.log(`args: ${JSON.stringify(args)}`);
    console.log(`context: ${JSON.stringify(context)}`);
    console.log(`info: ${JSON.stringify(info)}`);
    const result = await originalResolver(parent, args, context, info);
    console.log(`result: ${result}`);

    return result;
  };
};
