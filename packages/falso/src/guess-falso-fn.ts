import * as falso from '@ngneat/falso';
import { GraphQLType } from 'graphql';
import { unwrap } from 'graphql-mocks/graphql/type-utils';

export function guessFalsoFn(fieldName: string, returnType: GraphQLType): () => string | number | boolean | undefined {
  fieldName = fieldName.toLowerCase();
  const returnTypeName = unwrap(returnType).name.toLowerCase();

  if (returnTypeName === 'string') {
    if (fieldName.includes('name')) {
      return falso.randCity;
    }

    if (fieldName.includes('firstname')) {
      return falso.randFirstName;
    }

    if (fieldName.includes('lastname')) {
      return falso.randLastName;
    }

    if (fieldName.includes('email')) {
      return falso.randEmail;
    }

    if (fieldName.includes('gender') || fieldName.includes('sex')) {
      return falso.randGender;
    }

    if (fieldName.includes('city')) {
      return falso.randCity;
    }

    if (fieldName.includes('zipcode')) {
      return falso.randZipCode;
    }

    if (fieldName.includes('country')) {
      return falso.randCountry;
    }

    if (fieldName.includes('street')) {
      return falso.randStreetName;
    }

    if (fieldName.includes('color')) {
      return falso.randColor;
    }

    if (fieldName.includes('price')) {
      return () => falso.randAmount();
    }

    if (fieldName.includes('date')) {
      return () => falso.randSoonDate().toString();
    }

    if (fieldName.includes('currency')) {
      return falso.randCurrencyName;
    }

    if (fieldName.includes('creditcard')) {
      return falso.randCurrencyName;
    }

    if (fieldName.includes('image')) {
      return falso.randImg;
    }

    if (fieldName.includes('avatar')) {
      return falso.randAvatar;
    }

    if (fieldName.includes('username')) {
      return falso.randUserName;
    }

    if (fieldName.includes('password')) {
      return falso.randPassword;
    }

    if (fieldName.includes('ip')) {
      return falso.randIp;
    }

    if (fieldName.includes('url')) {
      return falso.randUrl;
    }

    if (fieldName.includes('phonenumber')) {
      return falso.randPhoneNumber;
    }

    if (fieldName.includes('locale')) {
      return falso.randLocale;
    }

    if (fieldName.includes('desc')) {
      return falso.randParagraph;
    }

    if (fieldName.includes('filename')) {
      return falso.randFileName;
    }

    if (fieldName.includes('filetype')) {
      return falso.randFileType;
    }

    if (fieldName.includes('time')) {
      return () => {
        const date = falso.randRecentDate();
        return `${date.getHours()}:${date.getMinutes()} ${falso.rand(['am', 'pm'])}`;
      };
    }

    if (fieldName.includes('id') || fieldName.includes('uuid')) {
      return falso.randUuid;
    }

    return falso.randWord;
  }

  if (returnTypeName === 'float') {
    return falso.randFloat;
  }

  if (returnTypeName === 'int') {
    return falso.randNumber;
  }

  if (returnTypeName === 'id') {
    return falso.randUuid;
  }

  if (returnTypeName === 'uuid') {
    return falso.randUuid;
  }

  if (returnTypeName === 'boolean') {
    return falso.randBoolean;
  }

  return () => void 0;
}
