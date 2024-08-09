import { expect } from 'chai';
import { unique } from '../../../../src/highlight/utils';

describe('highlight/utils/unique', function () {
  describe('#unique', function () {
    it('can unique field references', function () {
      expect(
        unique([
          ['User', 'firstName'],
          ['User', 'lastName'],
          ['User', 'lastName'],
          ['Query', 'users'],
        ]),
      ).to.deep.equal([
        ['User', 'firstName'],
        ['User', 'lastName'],
        ['Query', 'users'],
      ]);
    });

    it('can unique type references', function () {
      expect(unique(['User', 'Query', 'Query', 'Friends'])).to.deep.equal(['User', 'Query', 'Friends']);
    });

    it('can unique a mix of type and field references', function () {
      expect(
        unique([
          'User',
          'Query',
          'Query',
          ['User', 'firstName'],
          ['User', 'firstName'],
          ['User', 'lastName'],
          'Friends',
        ]),
      ).to.deep.equal(['User', 'Query', ['User', 'firstName'], ['User', 'lastName'], 'Friends']);
    });
  });
});
