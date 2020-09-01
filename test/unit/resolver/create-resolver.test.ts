import { createWrapper } from '../../../src/resolver/create-wrapper';
import { WrapperFor } from '../../../src/resolver/constant';
import { TypeResolver, FieldResolver, BaseWrapperOptions, ObjectField } from '../../../src/types';
import { spy } from 'sinon';
import { nameableInterfaceType, userObjectType, userObjectNameField, schema } from '../../mocks';
import { expect } from 'chai';
import { TypeWrapperFunction, FieldWrapperFunction, GenericWrapperFunction } from '../../../src/resolver/types';
import { GraphQLObjectType, GraphQLAbstractType } from 'graphql';

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

    const wrapperFn: TypeWrapperFunction = function (resolver: TypeResolver) {
      wrapped = (a, b, c, d): ReturnType<TypeResolver> => resolver(a, b, c, d);
      return wrapped;
    };

    const wrapper = createWrapper('my-type-wrapper', WrapperFor.TYPE, wrapperFn);
    const result = await wrapper.wrap(resolver, generateTypeWrapperOptions(WrapperFor.TYPE));
    expect(result).to.equal(wrapped);
  });

  it('creates a named wrapper for a field resolver', async function () {
    let wrapped: FieldResolver | undefined = undefined;

    const wrapperFn: FieldWrapperFunction = function (resolver: FieldResolver) {
      wrapped = (a, b, c, d): ReturnType<FieldResolver> => resolver(a, b, c, d);
      return wrapped;
    };

    const wrapper = createWrapper('my-type-wrapper', WrapperFor.FIELD, wrapperFn);
    const result = await wrapper.wrap(resolver, generateTypeWrapperOptions(WrapperFor.FIELD));
    expect(result).to.equal(wrapped);
  });

  it('creates a named wrapper for any (type or field) resolver', async function () {
    let wrapped: FieldResolver | TypeResolver | undefined = undefined;

    const wrapperFn: GenericWrapperFunction = function (resolver) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      wrapped = (a: any, b: any, c: any, d: any): any => resolver(a, b, c, d);
      return wrapped;
    };

    const wrapper = createWrapper('my-type-wrapper', WrapperFor.ANY, wrapperFn);
    const result = await wrapper.wrap(resolver, generateTypeWrapperOptions(WrapperFor.TYPE));
    expect(result).to.equal(wrapped);
  });

  it('throws if given incomplete wrapping context and options', async function () {
    let wrapped: TypeResolver | undefined = undefined;

    const wrapperFn: TypeWrapperFunction = function (resolver) {
      wrapped = (a, b, c, d): any => resolver(a, b, c, d as any);
      return wrapped;
    };

    const wrapper = createWrapper('my-type-wrapper', WrapperFor.TYPE, wrapperFn);

    let error: Error | undefined = undefined;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await wrapper.wrap(resolver, {} as any);
    } catch (e) {
      error = e;
    }

    expect(error?.message).to.equal('Exhausted possible wrapper types FIELD, TYPE, ANY');
  });
});
