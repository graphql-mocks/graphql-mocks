import { buildSchema, GraphQLScalarType, GraphQLSchema } from 'graphql';
import { attachScalarsToSchema } from '../../../src/graphql/utils';
import { spy, SinonSpy } from 'sinon';
import { expect } from 'chai';
import { BasicScalarDefinition } from '../../../src/types';

describe('utils/attach-scalars-to-schema', function () {
  let schema: GraphQLSchema;
  let spies: Record<'parseLiteral' | 'parseValue' | 'serialize', SinonSpy>;
  let testScalar: GraphQLScalarType;
  let basicScalarDefinition: BasicScalarDefinition;

  beforeEach(function () {
    spies = {
      parseLiteral: spy(),
      parseValue: spy(),
      serialize: spy(),
    };

    schema = buildSchema(`
      scalar TestScalar

      schema {
        query: Query
      }

      type Query {
        scalar: TestScalar
      }
    `);

    testScalar = new GraphQLScalarType({
      name: 'TestScalar',
      parseLiteral: spies.parseLiteral,
      parseValue: spies.parseValue,
      serialize: spies.serialize,
    });

    basicScalarDefinition = {
      parseLiteral: spies.parseLiteral,
      parseValue: spies.parseValue,
      serialize: spies.serialize,
    };
  });

  it('attaches scalars to schema instances from a GraphQLScalarType', function () {
    const schemaTestScalar = schema.getType('TestScalar') as GraphQLScalarType;

    expect(schemaTestScalar.parseLiteral).not.to.equal(spies.parseLiteral);
    expect(schemaTestScalar.parseValue).not.to.equal(spies.parseValue);
    expect(schemaTestScalar.serialize).not.to.equal(spies.serialize);

    attachScalarsToSchema(schema, {
      TestScalar: testScalar,
    });

    expect(schemaTestScalar.parseLiteral).to.equal(spies.parseLiteral);
    expect(schemaTestScalar.parseValue).to.equal(spies.parseValue);
    expect(schemaTestScalar.serialize).to.equal(spies.serialize);
  });

  it('attaches scalars to schema instances from a BasicScalarDefinition type', function () {
    const schemaTestScalar = schema.getType('TestScalar') as GraphQLScalarType;

    expect(schemaTestScalar.parseLiteral).not.to.equal(spies.parseLiteral);
    expect(schemaTestScalar.parseValue).not.to.equal(spies.parseValue);
    expect(schemaTestScalar.serialize).not.to.equal(spies.serialize);

    attachScalarsToSchema(schema, {
      TestScalar: basicScalarDefinition,
    });

    expect(schemaTestScalar.parseLiteral).to.equal(spies.parseLiteral);
    expect(schemaTestScalar.parseValue).to.equal(spies.parseValue);
    expect(schemaTestScalar.serialize).to.equal(spies.serialize);
  });

  it('attaches scalars definitions to the schema but skips applying a different name', function () {
    const testScalar = new GraphQLScalarType({
      name: 'DoesNotMatchScalarItIsBeingAppliedTo',
      parseLiteral: spies.parseLiteral,
      parseValue: spies.parseValue,
      serialize: spies.serialize,
    });

    const schemaTestScalar = schema.getType('TestScalar') as GraphQLScalarType;

    expect(schemaTestScalar.parseLiteral).not.to.equal(spies.parseLiteral);
    expect(schemaTestScalar.parseValue).not.to.equal(spies.parseValue);
    expect(schemaTestScalar.serialize).not.to.equal(spies.serialize);

    attachScalarsToSchema(schema, {
      TestScalar: testScalar,
    });

    expect(schemaTestScalar.name, 'name is untouched from the other properties copied over').to.equal('TestScalar');
    expect(schemaTestScalar.parseLiteral).to.equal(spies.parseLiteral);
    expect(schemaTestScalar.parseValue).to.equal(spies.parseValue);
    expect(schemaTestScalar.serialize).to.equal(spies.serialize);
  });

  it('throws if a scalar map includes a scalar that does not exist on the schema at all', function () {
    expect(() => {
      attachScalarsToSchema(schema, {
        NotAValidScalarName: basicScalarDefinition,
      });
    }).to.throw(
      'Could not find any type named "NotAValidScalarName". Double-check the scalar map where "NotAValidScalarName" is referenced against scalars defined in the graphql schema.',
    );
  });

  it('throws if a scalar map includes a scalar that does not exist on the schema as a scalar type', function () {
    expect(() => {
      attachScalarsToSchema(schema, {
        // `Query` exists on the schema under the `typeMap`, but is not a sclar
        Query: basicScalarDefinition,
      });
    }).to.throw(
      'Could not find a scalar type of "Query". Double-check the scalar map where "Query" is referenced against scalars defined in the graphql schema.',
    );
  });

  it('throws if the scalary map references a valid scalar but the definition in the map is not a valid definition', function () {
    expect(() => {
      attachScalarsToSchema(schema, {
        TestScalar: 'not a scalar definition',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    }).to.throw('Passed a scalar map with TestScalar but it is not a proper scalar definition');
  });
});
