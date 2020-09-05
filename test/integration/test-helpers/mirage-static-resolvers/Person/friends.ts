import { FieldResolver } from '../../../../../src/types';

const resolver: FieldResolver = function (parent /*, args, context, info*/) {
  return parent.friends.models;
};

export default resolver;
