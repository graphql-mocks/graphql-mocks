import { spy } from 'sinon';
import { wrapEach, WrapEachDetails } from '../resolver-map/wrap-each';
import { ResolverMapWrapper } from '../types';

export const spyWrapper: ResolverMapWrapper = wrapEach((originalResolver, wrapperDetails) => {
  const [type, field] = wrapperDetails.path;
  const packState = wrapperDetails.packOptions.packState;
  const resolverSpy = spy(originalResolver);

  packState.spies = packState.spies = {};
  packState.spies[type] = packState.spies[type] || {};
  packState.spies[type][field] = resolverSpy;

  return resolverSpy;
});
