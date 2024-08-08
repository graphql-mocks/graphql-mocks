import { expect } from 'chai';
import { FieldReference, TypeReference } from '../../../../src/highlight/types';
import { maskReference, unmaskReference } from '../../../../src/highlight/utils/reference-mask';

const mockTypeReference: TypeReference = 'SomeType';
const mockFieldReference: FieldReference = ['SomeType', 'someField'];

describe('#maskReference', function () {
  it('converts a type reference to a masked string', function () {
    const masked = maskReference(mockTypeReference);
    expect(masked).to.equal(`SomeType`);
  });

  it('converts a field reference to a masked string', function () {
    const masked = maskReference(mockFieldReference);
    expect(masked).to.equal(`#SomeType&someField`);
  });
});

describe('#unmaskReference', function () {
  it('unmasks a type reference back to the original reference', function () {
    expect(unmaskReference(maskReference(mockFieldReference))).to.deep.equal(mockFieldReference);
  });

  it('unmasks a field reference back to the original reference', function () {
    expect(unmaskReference(maskReference(mockFieldReference))).to.deep.equal(mockFieldReference);
  });
});
