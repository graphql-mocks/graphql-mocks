import { isScalarType } from 'graphql';
import { FieldValidator } from '../../types';
import { FieldReturnTypeMismatch } from '../errors/field-return-type-mismatch';

export const scalarFieldValidator: FieldValidator = {
  skipConnectionValue: false,
  skipNullValue: true,
  validate({ field, fieldValue }) {
    const jsScalars = ['boolean', 'number', 'string', 'float'];
    if (isScalarType(field.type) && !jsScalars.includes(typeof fieldValue)) {
      throw new FieldReturnTypeMismatch({
        field: field,
        expected: 'boolean, number, string',
        actual: typeof fieldValue,
      });
    }
  },
};
