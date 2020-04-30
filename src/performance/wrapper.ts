import { wrapEachField } from '../resolver-map/wrap-each-field';
import { ResolverMapWrapper } from '../types';

export const performanceWrapper: ResolverMapWrapper = wrapEachField((originalResolver, wrapperDetails) => {
  const { type, field } = wrapperDetails;
  const typeName = type.name;
  const fieldName = field.name;

  const packState = wrapperDetails.packOptions.state;
  packState.performance = packState.performance = {};
  packState.performance[typeName] = packState.performance[typeName] || {};
  packState.performance[typeName][fieldName] = packState.performance[typeName][fieldName] || [];

  return async (parent, args, context, info) => {
    const start = Date.now();
    const result = await originalResolver(parent, args, context, info);
    const end = Date.now();
    const difference = end - start;

    packState.performance[typeName][fieldName].push(difference);

    return result;
  };
});
