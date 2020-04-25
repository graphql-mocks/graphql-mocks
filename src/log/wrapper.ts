import { wrapEach } from '../resolver-map/wrap-each';
import { ResolverMapWrapper } from '../types';

export const logWrapper: ResolverMapWrapper = wrapEach((originalResolver, wrapperDetails) => {
  const [type, field] = wrapperDetails.path;

  return async (parent, args, context, info) => {
    console.log(`Resolver for type: "${type}" field: "${field}"`);
    console.log(`parent: ${JSON.stringify(parent)}`);
    console.log(`args: ${JSON.stringify(args)}`);
    console.log(`context: ${JSON.stringify(context)}`);
    console.log(`info: ${JSON.stringify(info)}`);
    const result = await originalResolver(parent, args, context, info);
    console.log(`result: ${result}`);

    return result;
  };
});
