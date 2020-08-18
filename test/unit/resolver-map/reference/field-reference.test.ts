import { expect } from 'chai';
import { unique, difference, fieldExistsInResolverMap } from '../../../../src/resolver-map/reference/field-reference';

describe('resolver-map/reference/field-reference', function () {
  describe('#unique', function () {
    it('can unique on redundant field references', function () {
      expect(
        unique([
          ['Query', 'field'],
          ['Query', 'otherField'],
          ['Query', 'field'],
        ]),
      ).to.deep.equal([
        ['Query', 'field'],
        ['Query', 'otherField'],
      ]);
    });
  });

  describe('#difference', function () {
    it('removes the second set from the first set', function () {
      expect(
        difference(
          [
            ['Query', 'field'],
            ['Query', 'otherField'],
          ],
          [['Query', 'otherField']],
        ),
      ).to.deep.equal([['Query', 'field']]);
    });
  });

  describe('#isfieldReferenceInResolverMap', function () {
    const resolverMap = {
      Query: {
        field: (): string => 'noop',
      },
    };

    it('returns true when a field exists in a resolver map', function () {
      expect(fieldExistsInResolverMap(resolverMap, ['Query', 'field'])).to.be.true;
    });

    it('returns false when a field does not exist in a resolver map', function () {
      expect(fieldExistsInResolverMap(resolverMap, ['Query', 'nonInMap'])).to.be.false;
    });
  });
});
