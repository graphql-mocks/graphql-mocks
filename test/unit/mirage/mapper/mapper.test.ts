import { expect } from 'chai';
import { MirageGraphQLMapper } from '../../../../src/mirage/mapper/mapper';

describe('mirage/mapper/mapper', function () {
  let mapper: MirageGraphQLMapper;

  beforeEach(() => {
    mapper = new MirageGraphQLMapper();
  });

  context('addFieldMapping', () => {
    it('adds associated Type/Model mapping', () => {
      mapper.addFieldMapping(['Type', 'field'], ['Model', 'attr']);
      expect(mapper.typeMappings[0]).to.deep.equal({ graphql: 'Type', mirage: 'Model' });
    });

    it('ignores Type/Model mapping when they are the same name', () => {
      mapper.addFieldMapping(['Type', 'field'], ['Type', 'attr']);
      expect(mapper.typeMappings.length).to.equal(0);
    });
  });
});
