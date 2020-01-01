import {PersonResolvers} from '../../../types';

const resolver: PersonResolvers["friends"] = function(parent, args, context, info) {
  const schema = context.mirageServer.schema;
  const serialize = context.mirageSerialize;

  return serialize(schema.people.find(parent.id).friends);
}

export default resolver;
