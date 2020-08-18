import { expect } from 'chai';
import { MirageGraphQLMapper } from '../../../../src/mirage/mapper/mapper';

describe('mirage/mapper/mapper', function () {
  let mapper: MirageGraphQLMapper;

  beforeEach(function () {
    mapper = new MirageGraphQLMapper();
  });

  context('addFieldMapping', function () {
    it('adds associated Type/Model mapping', function () {
      mapper.addFieldMapping(['Type', 'field'], ['Model', 'attr']);
      expect(mapper.typeMappings[0]).to.deep.equal({ graphql: 'Type', mirage: 'Model' });
    });

    it('ignores Type/Model mapping when they are the same name', function () {
      mapper.addFieldMapping(['Type', 'field'], ['Type', 'attr']);
      expect(mapper.typeMappings.length).to.equal(0);
    });
  });
});
