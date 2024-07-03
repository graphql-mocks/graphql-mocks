import { spy } from 'sinon';
import { createWrapper } from 'graphql-mocks/resolver';
import { WrapperFor } from 'graphql-mocks/resolver';

export const spyWrapper = createWrapper(
  'spy-wrapper',
  WrapperFor.FIELD,
  async function spyWrappercreate(originalResolver, wrapperDetails) {
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
  },
);
