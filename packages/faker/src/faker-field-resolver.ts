import { FakerMiddlewareOptions } from './types';
import { FieldResolver } from 'graphql-mocks/types';
import { hasListType, listItemType, unwrap } from 'graphql-mocks/graphql/type-utils';
import faker from 'faker';
import { isObjectType, isNonNullType, isEnumType, isAbstractType, GraphQLType } from 'graphql';
import { guessFakerFn } from './guess-faker-fn';

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

function booleanChance(percentage: number) {
  return getRandomInt(0, 100) < Math.floor(percentage);
}

export function fakerFieldResolver(options: FakerMiddlewareOptions): FieldResolver {
  return function internalFakerResolver(parent, _args, _context, info) {
    const parentTypeName = info.parentType?.name;
    const { fieldName, returnType }: { fieldName: string; returnType: GraphQLType } = info;

    if (parent && fieldName in parent) {
      return parent[fieldName];
    }

    const unwrappedReturnType = unwrap(returnType);
    const isList = hasListType(returnType);
    const isNonNull = isNonNullType(returnType);
    const fieldOptions = options.fields?.[parentTypeName]?.[fieldName];
    let fieldValues = fieldOptions?.possibleValues ?? [];
    const nullPercentage = fieldOptions?.nullPercentage ?? options?.nullPercentage ?? 10;
    const nullListPercentage = fieldOptions?.nullListPercentage ?? options?.nullListPercentage ?? nullPercentage;

    const [defaultMin, defaultMax] = [0, 10];
    const listCountOption = fieldOptions?.listCount ?? options?.listCount ?? { min: defaultMin, max: defaultMax };
    const { min, max } =
      typeof listCountOption === 'number' ? { min: listCountOption, max: listCountOption } : listCountOption;
    const listCount = getRandomInt(min, max);

    if (isEnumType(unwrappedReturnType)) {
      fieldValues = unwrappedReturnType.getValues().map((value) => value.value);
    }

    const getValue = (allowNull: boolean, nullPercentage: number) => {
      let value = null;
      let options = [...fieldValues].map((option) => (option == null ? null : option));

      if (options?.length && !allowNull) {
        options = options.filter((option) => option != null);
      }

      if (options?.length) {
        // use random option from specified values
        value = faker.random.arrayElement(options);
      } else if (typeof fieldOptions?.fakerFn === 'string') {
        // use a specified faker function
        const [fakerCategory, fakerMethod] = fieldOptions.fakerFn.split('.');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(faker as any)[fakerCategory]) {
          throw new Error(`Could not find faker category of ${fakerCategory}`);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(faker as any)[fakerCategory][fakerMethod]) {
          throw new Error(
            `Could not find faker function at "${fakerCategory}.${fakerMethod}", double-check the faker js docs`,
          );
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fn = (faker as any)[fakerCategory][fakerMethod];
        value = fn();
      } else {
        value = guessFakerFn(fieldName, returnType)();
      }

      if (allowNull) {
        value = booleanChance(nullPercentage) ? null : value;
      } else if (value == null) {
        value = guessFakerFn(fieldName, returnType)();
      }

      return value;
    };

    if (isObjectType(unwrappedReturnType) || isAbstractType(unwrappedReturnType)) {
      // handles list case where the *number* to resolve is determined here
      // but the actual data of each field is handled in follow up recursive
      // resolving for each individual field.
      if (isList) {
        return new Array(listCount).fill({});
      }

      // otherwise, return and let future resolvers figure
      // out the scalar field data
      return {};
    }

    if (isList) {
      const allowNullListItems = !isNonNullType(listItemType(returnType));

      return !isNonNull && booleanChance(nullPercentage)
        ? null
        : new Array(listCount).fill(null).map(() => getValue(allowNullListItems, nullListPercentage));
    } else {
      return getValue(!isNonNull, nullPercentage);
    }
  };
}
