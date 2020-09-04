import { createWrapper } from '../../../src/resolver/create-wrapper';
import { WrapperFor } from '../../../src/resolver/constant';
import { TypeResolver, FieldResolver, ObjectField } from '../../../src/types';
import { spy } from 'sinon';
import { nameableInterfaceType, userObjectType, userObjectNameField, schema } from '../../mocks';
import { expect } from 'chai';
import {
  TypeWrapperFunction,
  FieldWrapperFunction,
  GenericWrapperFunction,
  BaseWrapperOptions,
} from '../../../src/resolver/types';
import { GraphQLObjectType, GraphQLAbstractType, GraphQLResolveInfo, isInterfaceType } from 'graphql';

function generateTypeWrapperOptions(wrapperFor: WrapperFor): BaseWrapperOptions {
  let type: GraphQLObjectType | GraphQLAbstractType | undefined = undefined;
  let field: ObjectField | undefined;

  if (wrapperFor === WrapperFor.FIELD) {
    type = userObjectType;
    field = userObjectNameField;
  } else {
    type = nameableInterfaceType;
    field = undefined;
  }

  return {
    type,
    field,
    schema,
    resolverMap: {},
    packOptions: {
      state: {},
      dependencies: {},
    },
  };
}

describe('resolvers/create-wrapper', function () {
  let resolver: TypeResolver | FieldResolver;

  beforeEach(function () {
    resolver = spy();
  });

  it('creates a named wrapper for a type resolver', async function () {
    let wrapped: TypeResolver | undefined = undefined;

    const wrapperFn: TypeWrapperFunction = function (resolver: TypeResolver, options) {
      expect(options.field).to.be.undefined;
      wrapped = (a, b, c, d): ReturnType<TypeResolver> => resolver(a, b, c, d);
      return wrapped;
    };

    const wrapper = createWrapper('my-type-wrapper', WrapperFor.TYPE, wrapperFn);
    const result = await wrapper.wrap(resolver, generateTypeWrapperOptions(WrapperFor.TYPE));
    expect(result).to.equal(wrapped);
  });

  it('creates a named wrapper for a field resolver', async function () {
    let wrapped: FieldResolver | undefined = undefined;

    const wrapperFn: FieldWrapperFunction = function (resolver: FieldResolver, options) {
      expect(options.field).to.exist;
      wrapped = (a, b, c, d): ReturnType<FieldResolver> => resolver(a, b, c, d);
      return wrapped;
    };

    const wrapper = createWrapper('my-type-wrapper', WrapperFor.FIELD, wrapperFn);
    const result = await wrapper.wrap(resolver, generateTypeWrapperOptions(WrapperFor.FIELD));
    expect(result).to.equal(wrapped);
  });

  it('creates a named wrapper for any (type or field) resolver using a generic wrapper', async function () {
    let wrapped: FieldResolver | TypeResolver | undefined = undefined;

    const wrapperFn: GenericWrapperFunction = function (resolver, options) {
      expect(options).to.exist;
      wrapped = (a: unknown, b: unknown, c: unknown, d: unknown): ReturnType<typeof resolver> => {
        if (isInterfaceType(d)) {
          return (resolver as TypeResolver)(a, b, c as GraphQLResolveInfo, d);
        }
      };

      return wrapped;
    };

    const wrapper = createWrapper('my-type-wrapper', WrapperFor.ANY, wrapperFn);
    const result = await wrapper.wrap(resolver, generateTypeWrapperOptions(WrapperFor.TYPE));
    expect(result).to.equal(wrapped);
  });

  it('returns the original resolver if a match wrapper match is not found', async function () {
    let wrappedInWrapper: TypeResolver | undefined = undefined;

    const wrapperFn: TypeWrapperFunction = function (resolver, options) {
      expect(options).to.exist;
      wrappedInWrapper = (a, b, c, d): ReturnType<typeof resolver> => resolver(a, b, c, d);
      return wrappedInWrapper;
    };

    const wrapper = createWrapper('my-type-wrapper', WrapperFor.TYPE, wrapperFn);
    const wrapped = await wrapper.wrap(resolver, generateTypeWrapperOptions(WrapperFor.FIELD));

    expect(wrapped).to.not.equal(wrappedInWrapper);
    expect(wrapped).to.equal(resolver);
  });
});
