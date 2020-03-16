import { addMirageToContextWrapper } from '../../../src/mirage/wrappers/add-context';
import { ResolverMap } from '../../../src/types';
import { spy, SinonSpy } from 'sinon';
import { expect } from 'chai';
import { generateEmptyPackOptions } from '../../mocks';

describe('mirage/add-context', function() {
  let mockMirageServer: any;
  let resolverMap: ResolverMap | undefined;

  beforeEach(() => {
    mockMirageServer = {
      schema: {},
    };

    resolverMap = {
      Query: {
        rootField: spy(),
      },
    };
  });

  afterEach(() => {
    mockMirageServer = undefined;
    resolverMap = undefined;
  });

  it('adds mirage to graphql resolver context', async function() {
    const wrapper = addMirageToContextWrapper(mockMirageServer);
    const wrappedResolvers = wrapper(resolverMap as ResolverMap, generateEmptyPackOptions());

    const context = {
      previouslySetContext: 'hello world',
    };

    wrappedResolvers.Query.rootField({}, {}, context, {});
    const rootFieldSpy = resolverMap?.Query.rootField as SinonSpy;

    expect(rootFieldSpy.called).to.be.true;
    const finalResovlerContext = rootFieldSpy.firstCall.args[2];

    expect(finalResovlerContext.previouslySetContext).to.equal('hello world', 'original context is still present');
    expect(finalResovlerContext.mirage.server).to.equal(mockMirageServer, 'context includes mirage server');
    expect(finalResovlerContext.mirage.schema).to.equal(mockMirageServer.schema, 'context includes mirage schema');
  });
});
