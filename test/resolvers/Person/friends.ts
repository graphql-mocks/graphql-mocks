import {PersonResolvers} from '../../../types';

const resolver: PersonResolvers["friends"] = function(parent, args, context, info) {
  const {schema, serialize} = context.mirage;
  return serialize(schema.people.find(parent.id).friends);
}

export default resolver;
