import { expect } from 'chai';
import { referenceDifference, referenceIntersection } from '../../../../src/highlight/utils/reference-set-helpers';

describe('highlight/utils/reference-test-helpers', function () {
  describe('#referenceIntersection', function () {
    it('can find the intersection between two sets of type references', function () {
      expect(referenceIntersection(['A', 'B', 'C', 'D'], ['B', 'C', 'E', 'F'])).to.deep.equal(['B', 'C']);
    });

    it('can find the intersection between two sets of field references', function () {
      expect(
        referenceIntersection(
          [
            ['A', 'one'],
            ['A', 'two'],
            ['B', 'one'],
            ['B', 'two'],
          ],
          [
            ['A', 'two'],
            ['B', 'one'],
            ['C', 'one'],
          ],
        ),
      ).to.deep.equal([
        ['A', 'two'],
        ['B', 'one'],
      ]);
    });

    it('can find the intersection between two sets of mixed field and type references', function () {
      expect(
        referenceIntersection(
          ['A', ['A', 'one'], ['A', 'two'], 'B', ['B', 'one'], ['B', 'two'], 'C'],
          ['B', ['A', 'two'], ['B', 'one'], ['C', 'one'], 'D', 'E'],
        ),
      ).to.deep.equal([['A', 'two'], 'B', ['B', 'one']]);
    });
  });

  describe('#referenceDifference', function () {
    it('can find the difference between sets of type references (A - B)', function () {
      expect(referenceDifference(['A', 'B', 'C'], ['B', 'D'])).to.deep.equal(['A', 'C']);
    });

    it('can find the difference between sets of field references (A - B)', function () {
      expect(
        referenceDifference(
          [
            ['A', 'one'],
            ['B', 'one'],
            ['C', 'one'],
          ],
          [
            ['B', 'one'],
            ['D', 'one'],
          ],
        ),
      ).to.deep.equal([
        ['A', 'one'],
        ['C', 'one'],
      ]);
    });

    it('can find the difference between sets of mixed field and type references (A - B)', function () {
      expect(
        referenceDifference(
          ['A', ['A', 'one'], ['B', 'one'], 'B', ['C', 'one'], 'C'],
          ['B', ['B', 'one'], ['D', 'one']],
        ),
      ).to.deep.equal(['A', ['A', 'one'], ['C', 'one'], 'C']);
    });
  });
});
