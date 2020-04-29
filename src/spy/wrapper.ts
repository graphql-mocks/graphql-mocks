import { spy } from 'sinon';
import { wrapEachField } from '../resolver-map/wrap-each-field';
import { ResolverMapWrapper } from '../types';

export const spyWrapper: ResolverMapWrapper = wrapEachField((originalResolver, wrapperDetails) => {
  const [type, field] = wrapperDetails.path;
  const packState = wrapperDetails.packOptions.state;
  const resolverSpy = spy(originalResolver);

  packState.spies = packState.spies = {};
  packState.spies[type] = packState.spies[type] || {};
  packState.spies[type][field] = resolverSpy;

  return resolverSpy;
});
