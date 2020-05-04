import { ResolverWrapper } from '../types';

export const logWrapper: ResolverWrapper = (originalResolver, wrapperDetails) => {
  const { type, field } = wrapperDetails;
  const typeName = type.name;
  const fieldName = field.name;

  return async (parent, args, context, info) => {
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
