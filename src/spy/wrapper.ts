import { spy } from 'sinon';
import { ResolverWrapper } from '../types';

export const spyWrapper: ResolverWrapper = (originalResolver, wrapperDetails) => {
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
