import { stashStateWrapper, stashFor } from '../../../src/stash-state/wrapper';
import { pack } from '../../../src/resolver-map/pack';
import { ResolverMap } from '../../../src/types';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { generatePackOptions } from '../../mocks';
import { buildSchema } from 'graphql';

describe('stash-state/wrapper', function () {
  it('saves stashes on a result object', function () {
    const graphqlSchema = buildSchema(`type Query {
      rootQueryField: String!
    }`);
    const resolverReturn = {};
    const resolverSpy = sinon.spy(() => resolverReturn);

    const resolverMap: ResolverMap = {
      Query: {
        rootQueryField: resolverSpy,
      },
    };

    const { resolvers: wrappedResolvers } = pack(
      resolverMap,
      [stashStateWrapper],
      generatePackOptions({ dependencies: { graphqlSchema } }),
    );

    const parent = { parent: 'parent' };
    const args = { args: 'args' };
    const context = { keyOnContext: 'valueOnContext' };
    const info = { info: 'info' };

    wrappedResolvers.Query.rootQueryField(parent, args, context, info);
    const stashed = stashFor(resolverSpy.firstCall.returnValue);

    expect(stashed?.parent).to.equal(parent);
    expect(stashed?.args).to.equal(args);
    expect(stashed?.context.keyOnContext).to.equal('valueOnContext');
    expect(stashed?.context.pack).to.exist;
    expect(stashed?.info).to.equal(info);
    expect(stashed?.result).to.equal(resolverReturn);
  });
});
