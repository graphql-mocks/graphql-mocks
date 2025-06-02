import {
  buildSchema,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLFieldMap,
  defaultFieldResolver,
  GraphQLScalarType,
} from 'graphql';
import { attachFieldResolversToSchema, attachScalarsToSchema } from '../../../src/graphql/utils';
import { expect } from 'chai';
import { spy } from 'sinon';
import { callResolver } from '../../helpers/call-resolver';
import { FieldResolver, TypeResolver } from '../../../src/types';

function getAttachedPipeline(resolver?: FieldResolver | TypeResolver) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return resolver && (resolver as any).pipeline;
}

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
      const queryObjectResolver = spy();
      const queryScalarResolver = spy();
      const someTypeFieldResolver = spy();

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

      // check that attached resolvers are pipeline resolvers
      expect(getAttachedPipeline(queryFields.object.resolve)).to.exist;
      expect(getAttachedPipeline(queryFields.scalar.resolve)).to.exist;
      expect(getAttachedPipeline(someTypeFields.someTypeField.resolve)).to.exist;

      // calling resolvers should call the attached resolvers
      callResolver(queryFields.object.resolve);
      callResolver(queryFields.scalar.resolve);
      callResolver(someTypeFields.someTypeField.resolve);

      expect(queryObjectResolver.calledOnce).to.be.true;
      expect(queryScalarResolver.calledOnce).to.be.true;
      expect(someTypeFieldResolver.calledOnce).to.be.true;
    });

    it('resolvers not found in the resolverMap are filled with pipeline resolvers', function () {
      const queryObjectResolver = spy();

      expect(queryFields.object.resolve).to.equal(undefined);
      expect(queryFields.scalar.resolve).to.equal(undefined);
      expect(someTypeFields.someTypeField.resolve).to.equal(undefined);

      attachFieldResolversToSchema(schema, {
        Query: {
          object: queryObjectResolver,
        },
      });

      // in the resolver map
      const queryFieldsObjectResolver = queryFields.object.resolve;
      expect(queryFieldsObjectResolver).to.exist;
      callResolver(queryFields.object.resolve);
      expect(queryObjectResolver.calledOnce).to.be.true;
      const scalarPipeline = getAttachedPipeline(queryFieldsObjectResolver);
      expect(scalarPipeline.resolvers).to.have.lengthOf(1);
      expect(scalarPipeline.resolvers[0]).to.equal(queryObjectResolver);

      // not in the resolver map
      const someTypeFieldsResolver = someTypeFields.someTypeField.resolve;
      expect(someTypeFieldsResolver, 'resolvers not in resolver map have pipeline resolvers').to.exist;
      const someTypePipeline = getAttachedPipeline(someTypeFieldsResolver);
      expect(someTypePipeline.resolvers).to.have.lengthOf(1);
      expect(someTypePipeline.resolvers[0]).to.equal(defaultFieldResolver);
    });

    it('ignores resolvers not in the schema', function () {
      const queryObjectResolver = spy();

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

      callResolver(queryFields.object.resolve);
      expect(queryObjectResolver.calledOnce).to.be.true;

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
