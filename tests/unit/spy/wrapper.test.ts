import { spyWrapper } from '../../../src/spy/wrapper';
import { pack } from '../../../src/resolver-map/pack';
import { ResolverMap } from '../../../src/types';
import { expect } from 'chai';
import { generatePackOptions } from '../../mocks';
import { buildSchema } from 'graphql';
import { wrapEachField } from '../../../src/resolver-map/wrap-each-field';

describe('spy/wrapper', function () {
  it('provides accesss to spies on resolvers', function () {
    const graphqlSchema = buildSchema(`type Query {
      rootQueryField: String!
    }`);

    const resolverMap: ResolverMap = {
      Query: {
        // eslint-disable-next-line
        rootQueryField: () => {},
      },
    };

    const { state, resolvers: wrappedResolvers } = pack(
      resolverMap,
      [wrapEachField([spyWrapper])],
      generatePackOptions({ dependencies: { graphqlSchema } }),
    );

    const rootQueryFieldSpy = state.spies.Query.rootQueryField;
    expect(rootQueryFieldSpy.called).to.equal(false);

    wrappedResolvers.Query.rootQueryField({}, {}, {}, {});
    expect(rootQueryFieldSpy.called).to.equal(true);
  });
});
