import {PersonResolvers} from '../../../types';
import {schema, serialize} from '../../mirage';

const resolver: PersonResolvers["friends"] = function(parent, args, context, info) {
  return serialize(schema.people.find(parent.id).friends);
}

export default resolver;
