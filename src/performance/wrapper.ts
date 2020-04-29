import { wrapEachField } from '../resolver-map/wrap-each-field';
import { ResolverMapWrapper } from '../types';

export const performanceWrapper: ResolverMapWrapper = wrapEachField((originalResolver, wrapperDetails) => {
  const [type, field] = wrapperDetails.path;
  const packState = wrapperDetails.packOptions.state;
  packState.performance = packState.performance = {};
  packState.performance[type] = packState.performance[type] || {};
  packState.performance[type][field] = packState.performance[type][field] || [];

  return async (parent, args, context, info) => {
    const start = Date.now();
    const result = await originalResolver(parent, args, context, info);
    const end = Date.now();
    const difference = end - start;

    packState.performance[type][field].push(difference);

    return result;
  };
});
