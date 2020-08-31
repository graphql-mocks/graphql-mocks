import { spy } from 'sinon';
import { FieldWrapperFunction } from '../resolver/types';

export const spyWrapper: FieldWrapperFunction = async function spyWrapper(originalResolver, wrapperDetails) {
  const { type, field } = wrapperDetails;

  if (!type || !field) {
    return originalResolver;
  }

  const typeName = type.name;
  const fieldName = field.name;

  const packState = wrapperDetails.packOptions.state;
  const resolverSpy = spy(originalResolver);

  packState.spies = packState.spies ?? {};
  packState.spies[typeName] = packState.spies[typeName] ?? {};
  packState.spies[typeName][fieldName] = resolverSpy;

  return resolverSpy;
};
