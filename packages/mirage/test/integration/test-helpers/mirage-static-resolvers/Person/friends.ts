import { FieldResolver } from 'graphql-mocks/types';

const resolver: FieldResolver = function (parent /*, args, context, info*/) {
  return parent.friends.models;
};

export default resolver;
