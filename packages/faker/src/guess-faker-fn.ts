import faker from 'faker';
import { GraphQLType } from 'graphql';
import { unwrap } from 'graphql-mocks/graphql/type-utils';

export function guessFakerFn(fieldName: string, returnType: GraphQLType): () => string | number | boolean | undefined {
  fieldName = fieldName.toLowerCase();
  const returnTypeName = unwrap(returnType).name.toLowerCase();

  if (returnTypeName === 'string') {
    if (fieldName.includes('name')) {
      return faker.address.cityName;
    }

    if (fieldName.includes('firstname')) {
      return faker.name.firstName;
    }

    if (fieldName.includes('lastname')) {
      return faker.name.lastName;
    }

    if (fieldName.includes('email')) {
      return faker.internet.email;
    }

    if (fieldName.includes('gender') || fieldName.includes('sex')) {
      return faker.name.gender;
    }

    if (fieldName.includes('city')) {
      return faker.address.cityName;
    }

    if (fieldName.includes('zipcode')) {
      return faker.address.zipCode;
    }

    if (fieldName.includes('country')) {
      return faker.address.country;
    }

    if (fieldName.includes('street')) {
      return faker.address.streetName;
    }

    if (fieldName.includes('color')) {
      return faker.commerce.color;
    }

    if (fieldName.includes('price')) {
      return faker.commerce.price;
    }

    if (fieldName.includes('date')) {
      return () => faker.date.past.toString();
    }

    if (fieldName.includes('currency')) {
      return faker.finance.currencyName;
    }

    if (fieldName.includes('creditcard')) {
      return faker.finance.creditCardNumber;
    }

    if (fieldName.includes('sha')) {
      return faker.git.commitSha;
    }

    if (fieldName.includes('image')) {
      return faker.image.imageUrl;
    }

    if (fieldName.includes('avatar')) {
      return faker.image.avatar;
    }

    if (fieldName.includes('username')) {
      return faker.internet.userName;
    }

    if (fieldName.includes('password')) {
      return faker.internet.password;
    }

    if (fieldName.includes('ip')) {
      return faker.internet.ip;
    }

    if (fieldName.includes('url')) {
      return faker.internet.url;
    }

    if (fieldName.includes('phonenumber')) {
      return faker.phone.phoneNumber;
    }

    if (fieldName.includes('locale')) {
      return faker.random.locale;
    }

    if (fieldName.includes('desc')) {
      return faker.lorem.paragraph;
    }

    if (fieldName.includes('filename')) {
      return faker.system.fileName;
    }

    if (fieldName.includes('filetype')) {
      return faker.system.fileType;
    }

    if (fieldName.includes('time')) {
      return faker.time.recent;
    }

    if (fieldName.includes('id') || fieldName.includes('uuid')) {
      return faker.datatype.uuid;
    }

    return faker.lorem.word;
  }

  if (returnTypeName === 'float') {
    return faker.datatype.float;
  }

  if (returnTypeName === 'int') {
    return faker.datatype.number;
  }

  if (returnTypeName === 'id') {
    return faker.datatype.uuid;
  }

  if (returnTypeName === 'uuid') {
    return faker.datatype.uuid;
  }

  if (returnTypeName === 'boolean') {
    return faker.datatype.boolean;
  }

  return () => void 0;
}
