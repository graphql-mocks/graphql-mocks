import { expect } from 'chai';
import { buildSchema } from 'graphql';
import { fakerFieldResolver } from '../../src/faker-field-resolver';
import { FakerFieldOptions } from '../../src/types';
import { GraphQLResolveInfo } from 'graphql';
import sinon from 'sinon';
import faker from 'faker';

const schema = buildSchema(`
  schema {
    query: Query
  }

  type Query {
    id: ID
    int: Int
    float: Float
    boolean: Boolean
    string: String
    nonNull: String!
    list: [String]
    enum: Enum
    enumList: [Enum]
    nonNullList: [String]!
    nonNullListItem: [String!]
    object: ObjectOne
    listOfObjects: [ObjectOne]
    interface: Interface
    listOfInterfaces: [Interface]
    union: Union
    listOfUnions: [Union]

    # for guess-faker-fn
    url: String
    randomURL: String
  }

  enum Enum {
    HELLO
    WORLD
  }

  type ObjectOne {
    id: ID
  }

  type ObjectTwo {
    id: ID
  }

  union Union = ObjectOne | ObjectTwo

  interface Interface {
    id: ID
  }

  type ObjectThree implements Interface {
    id: ID
  }

  type ObjectFour implements Interface {
    id: ID
  }
`);

function buildInfo(fieldName: string): GraphQLResolveInfo {
  return ({
    parentType: {
      name: 'Query',
    },
    fieldName,
    returnType: schema.getQueryType()?.getFields()[fieldName].type,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any) as GraphQLResolveInfo;
}

const TEST_DEFAULT_LIST_COUNT = 3;

function buildOptions(fieldName: string, fieldOptions?: FakerFieldOptions) {
  return {
    fields: {
      Query: {
        [fieldName]: {
          nullPercentage: 0,
          listCount: TEST_DEFAULT_LIST_COUNT,
          ...fieldOptions,
        },
      },
    },
  };
}

describe('faker-field-resolver', function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let sandbox: any;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
  });

  this.afterEach(function () {
    sandbox.restore();
  });

  it('returns returns the parent property if it exists', async function () {
    const fieldName = 'id';
    const info = buildInfo(fieldName);
    const options = buildOptions(fieldName);

    const result = fakerFieldResolver(options)({ id: 'USE PARENT ID FIELD' }, {}, null, info);
    expect(result).to.be.equal('USE PARENT ID FIELD');
  });

  context('types', function () {
    it('handles ID types', async function () {
      const fieldName = 'id';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName);

      const result = fakerFieldResolver(options)(null, {}, null, info);
      expect(typeof result).to.be.equal('string');
    });

    it('handles Int types', async function () {
      const fieldName = 'int';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName);

      const result = fakerFieldResolver(options)(null, {}, null, info);
      expect(typeof result).to.be.equal('number');
      expect(Math.round(result)).to.be.equal(result);
    });

    it('handles Float types', async function () {
      const fieldName = 'float';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName);

      const result = fakerFieldResolver(options)(null, {}, null, info);
      expect(typeof result).to.be.equal('number');
      expect(Math.round(result)).to.not.be.equal(result);
    });

    it('handles Boolean types', async function () {
      const fieldName = 'boolean';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName);

      const result = fakerFieldResolver(options)(null, {}, null, info);
      expect(typeof result).to.be.equal('boolean');
    });

    it('handles String types', async function () {
      const fieldName = 'string';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName);

      const result = fakerFieldResolver(options)(null, {}, null, info);
      expect(typeof result).to.be.equal('string');
      expect(result.length).to.be.greaterThan(0);
    });

    it('handles List types', async function () {
      const fieldName = 'list';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName);

      const result = fakerFieldResolver(options)(null, {}, null, info);
      expect(Array.isArray(result)).to.be.equal(true);
      expect(result.length).to.equal(TEST_DEFAULT_LIST_COUNT);
    });

    it('handles Enum types', async function () {
      const fieldName = 'enum';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName);

      const result = fakerFieldResolver(options)(null, {}, null, info);
      expect(typeof result).to.be.equal('string');
      expect(['HELLO', 'WORLD']).to.include(result);
    });

    it('handles Enum List types', async function () {
      const fieldName = 'enumList';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName);

      const result = fakerFieldResolver(options)(null, {}, null, info);
      expect(Array.isArray(result)).to.be.equal(true);
      expect(result.length).to.equal(TEST_DEFAULT_LIST_COUNT);
      result.forEach((item: string) => expect(['HELLO', 'WORLD']).includes(item));
    });

    it('skips Object types', async function () {
      const fieldName = 'object';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName);

      const result = fakerFieldResolver(options)(null, {}, null, info);
      expect(result).to.equal(undefined);
    });

    it('skips List of Object types', async function () {
      const fieldName = 'listOfObjects';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName);

      const result = fakerFieldResolver(options)(null, {}, null, info);
      expect(result).to.equal(undefined);
    });

    it('skips Union types', async function () {
      const fieldName = 'union';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName);

      const result = fakerFieldResolver(options)(null, {}, null, info);
      expect(result).to.equal(undefined);
    });

    it('skips List of Union types', async function () {
      const fieldName = 'listOfUnions';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName);

      const result = fakerFieldResolver(options)(null, {}, null, info);
      expect(result).to.equal(undefined);
    });

    it('skips Interface types', async function () {
      const fieldName = 'union';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName);

      const result = fakerFieldResolver(options)(null, {}, null, info);
      expect(result).to.equal(undefined);
    });

    it('skips Interface types', async function () {
      const fieldName = 'listOfInterfaces';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName);

      const result = fakerFieldResolver(options)(null, {}, null, info);
      expect(result).to.equal(undefined);
    });
  });

  context('options', function () {
    it('uses nullPercentage', async function () {
      const fieldName = 'string';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName, { nullPercentage: 100 });

      for (let i = 0; i < 100; i++) {
        const result = fakerFieldResolver(options)(null, {}, null, info);
        expect(result).to.equal(null);
      }
    });

    it('uses nullListPercentage', async function () {
      const fieldName = 'list';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName, { nullListPercentage: 100 });

      for (let i = 0; i < 100; i++) {
        const result = fakerFieldResolver(options)(null, {}, null, info);
        expect(result).to.deep.equal([null, null, null]);
      }
    });

    it('uses an exact listCount', async function () {
      const listCount = 7;
      const fieldName = 'list';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName, { listCount });

      const result = fakerFieldResolver(options)(null, {}, null, info);
      expect(result).to.have.lengthOf(7);
    });

    it('uses an exact listCount with min & max', async function () {
      const listCount = { min: 4, max: 7 };
      const fieldName = 'list';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName, { listCount });

      for (let i = 0; i < 100; i++) {
        const result = fakerFieldResolver(options)(null, {}, null, info);
        expect(result.length).to.be.gte(4);
        expect(result.length).to.be.lte(7);
        result.forEach((item: unknown) => expect(typeof item).to.equal('string'));
      }
    });

    it('uses possibleValues for non-list', async function () {
      const possibleValues = ['bonjour', 'hello', 'hej'];
      const fieldName = 'string';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName, { possibleValues });

      const result = fakerFieldResolver(options)(null, {}, null, info);
      expect(possibleValues).include(result);
    });

    it('uses possibleValues for lists', async function () {
      const possibleValues = ['bonjour', 'hello', 'hej'];
      const fieldName = 'list';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName, { possibleValues });

      const result = fakerFieldResolver(options)(null, {}, null, info);
      result.forEach((item: string) => {
        expect(possibleValues).to.include(item);
      });
    });

    it('uses fakerFn for non-lists', async function () {
      const spy = sandbox.spy(faker.name, 'firstName');
      const fieldName = 'string';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName, { fakerFn: 'name.firstName' });

      const result = fakerFieldResolver(options)(null, {}, null, info);
      expect(typeof result).to.equal('string');
      expect(spy.called).to.be.true;
    });

    it('uses fakerFn for list', async function () {
      const spy = sandbox.spy(faker.name, 'firstName');
      const fieldName = 'list';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName, { fakerFn: 'name.firstName' });

      const result = fakerFieldResolver(options)(null, {}, null, info);
      expect(Array.isArray(result)).to.equal(true);
      expect(result).to.have.lengthOf(TEST_DEFAULT_LIST_COUNT);
      expect(spy.callCount).to.equal(3);
    });
  });

  context('guess-faker-fn', async function () {
    it('guesses the faker fn to use based on the exact field name', async function () {
      const spy = sandbox.spy(faker.internet, 'url');
      const fieldName = 'url';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName);

      const result = fakerFieldResolver(options)(null, {}, null, info);
      expect(spy.called).to.have.be.true;
      expect(() => new URL(result)).to.not.throw();
    });

    it('guesses the faker fn to use based on a containing field name', async function () {
      const spy = sandbox.spy(faker.internet, 'url');
      const fieldName = 'randomURL';
      const info = buildInfo(fieldName);
      const options = buildOptions(fieldName);

      const result = fakerFieldResolver(options)(null, {}, null, info);
      expect(spy.called).to.have.be.true;
      expect(() => new URL(result)).to.not.throw();
    });
  });
});
