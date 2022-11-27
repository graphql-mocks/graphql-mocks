import { buildSchema, GraphQLSchema, GraphQLObjectType, GraphQLFieldMap, GraphQLScalarType } from 'graphql';
import { attachFieldResolversToSchema, attachScalarsToSchema } from '../../../src/graphql/utils';
import { expect } from 'chai';
import { spy } from 'sinon';

describe('graphql/utils', function () {
  context('#attachFieldResolversToSchema', function () {
    let schema: GraphQLSchema;
    let queryFields: GraphQLFieldMap<unknown, unknown>;
    let someTypeFields: GraphQLFieldMap<unknown, unknown>;

    beforeEach(function () {
      schema = buildSchema(`
        schema {
          query: Query
        }

        type Query {
          object: SomeType!
          scalar: String!
        }

        type SomeType {
          someTypeField: String!
        }
      `);

      const typeMap = schema.getTypeMap();
      queryFields = (typeMap['Query'] as GraphQLObjectType).getFields();
      someTypeFields = (typeMap['SomeType'] as GraphQLObjectType).getFields();
    });

    it('attaches resolvers from a resolverMap to a schema', function () {
      const queryObjectResolver = (): string => 'noop';
      const queryScalarResolver = (): string => 'noop';
      const someTypeFieldResolver = (): string => 'noop';

      expect(queryFields.object.resolve).to.equal(undefined);
      expect(queryFields.scalar.resolve).to.equal(undefined);
      expect(someTypeFields.someTypeField.resolve).to.equal(undefined);

      attachFieldResolversToSchema(schema, {
        Query: {
          object: queryObjectResolver,
          scalar: queryScalarResolver,
        },

        SomeType: {
          someTypeField: someTypeFieldResolver,
        },
      });

      expect(queryFields.object.resolve).to.equal(queryObjectResolver);
      expect(queryFields.scalar.resolve).to.equal(queryScalarResolver);
      expect(someTypeFields.someTypeField.resolve).to.equal(someTypeFieldResolver);
    });

    it('ignores resolvers not found in the resolverMap', function () {
      const queryObjectResolver = (): string => 'noop';

      expect(queryFields.object.resolve).to.equal(undefined);
      expect(queryFields.scalar.resolve).to.equal(undefined);
      expect(someTypeFields.someTypeField.resolve).to.equal(undefined);

      attachFieldResolversToSchema(schema, {
        Query: {
          object: queryObjectResolver,
        },
      });

      expect(queryFields.object.resolve).to.equal(queryObjectResolver);
      expect(queryFields.scalar.resolve, 'resolvers not in resolver map remain undefined').to.equal(undefined);
      expect(someTypeFields.someTypeField.resolve, 'resolvers not in resolver map remain undefined').to.equal(
        undefined,
      );
    });

    it('ignores resolvers not in the schema', function () {
      const queryObjectResolver = (): string => 'noop';

      expect(queryFields.object.resolve).to.equal(undefined);

      attachFieldResolversToSchema(schema, {
        Query: {
          object: queryObjectResolver,
          fieldsDoesNotExist: (): string => 'noop',
        },

        TypeDoesNotExist: {
          fieldsDoesNotExist: (): string => 'noop',
        },
      });

      expect(queryFields.object.resolve).to.equal(queryObjectResolver);
      expect(queryFields.fieldsDoesNotExist).to.not.exist;
    });

    it('ignores resolvers that are not functions', function () {
      const queryObjectResolver = 'NOT A FUNCTION';
      expect(queryFields.object.resolve).to.equal(undefined);

      attachFieldResolversToSchema(schema, {
        Query: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          object: queryObjectResolver as any,
        },
      });

      expect(queryFields.object.resolve, 'skips adding a resolver that is not a function').to.equal(undefined);
    });
  });

  context('#attachScalarsToSchema', function () {
    let schema: GraphQLSchema;

    beforeEach(function () {
      schema = buildSchema(`
        schema {
          query: Query
        }

        scalar JSON

        type Query {
          json: JSON!
        }
      `);
    });

    it('adds a custom scalar by scalar definition', function () {
      const serialize = spy();
      const parseLiteral = spy();
      const parseValue = spy();

      const scalarDefinition = {
        serialize,
        parseLiteral,
        parseValue,
      };

      attachScalarsToSchema(schema, {
        JSON: scalarDefinition,
      });

      const jsonScalar = schema.getType('JSON') as GraphQLScalarType;
      expect(jsonScalar.serialize).to.equal(serialize);
      expect(jsonScalar.parseLiteral).to.equal(parseLiteral);
      expect(jsonScalar.parseValue).to.equal(parseValue);
    });

    it('adds a custom scalar by GraphQLScalarType instance', function () {
      const serialize = spy();
      const parseLiteral = spy();
      const parseValue = spy();

      const scalarType = new GraphQLScalarType({
        name: 'JSON',
        serialize,
        parseLiteral,
        parseValue,
      });

      attachScalarsToSchema(schema, {
        JSON: scalarType,
      });

      const jsonScalar = schema.getType('JSON') as GraphQLScalarType;
      expect(jsonScalar.serialize).to.equal(serialize);
      expect(jsonScalar.parseLiteral).to.equal(parseLiteral);
      expect(jsonScalar.parseValue).to.equal(parseValue);
    });
  });
});
