import { stashStateWrapper, stashFor } from '../../../src/stash-state/wrapper';
import { ResolverMap } from '../../../src/types';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { generatePackOptions, userObjectType, userObjectNameField } from '../../mocks';

describe('stash-state/wrapper', function () {
  it('saves stashes on a result object', function () {
    const resolverReturn = {};
    const initialResolver = sinon.spy(() => resolverReturn);
    const resolverMap: ResolverMap = {};

    const wrappedResolver = stashStateWrapper(initialResolver, {
      resolvers: resolverMap,
      packOptions: generatePackOptions(),
      type: userObjectType,
      field: userObjectNameField,
    });

    const parent = { parent: 'parent' };
    const args = { args: 'args' };
    const context = { keyOnContext: 'valueOnContext' };
    const info = { info: 'info' } as any;

    wrappedResolver(parent, args, context, info);
    const stashed = stashFor(initialResolver.firstCall.returnValue);

    expect(stashed?.parent).to.equal(parent);
    expect(stashed?.args).to.equal(args);
    expect(stashed?.context.keyOnContext).to.equal('valueOnContext');
    expect(stashed?.info).to.equal(info);
    expect(stashed?.result).to.equal(resolverReturn);
  });
});
