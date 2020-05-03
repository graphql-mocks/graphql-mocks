import { spy } from 'sinon';
import { wrapEachField } from '../resolver-map/wrap-each-field';
import { ResolverMapWrapper, ResolverWrapper } from '../types';

export const spyWrapperSingular: ResolverWrapper = (originalResolver, wrapperDetails) => {
  const { type, field } = wrapperDetails;
  const typeName = type.name;
  const fieldName = field.name;
  const packState = wrapperDetails.packOptions.state;
  const resolverSpy = spy(originalResolver);

  packState.spies = packState.spies = {};
  packState.spies[typeName] = packState.spies[typeName] || {};
  packState.spies[typeName][fieldName] = resolverSpy;

  return resolverSpy;
};

export const spyWrapper: ResolverMapWrapper = wrapEachField([spyWrapperSingular]);
