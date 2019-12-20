import {PersonResolvers, Person} from '../../../types';
import {schema} from '../../mirage';

const resolver: PersonResolvers["friends"] = function(parent, args, context, info) {
  const {models: friends} = schema.people.find(parent.id).friends;
  return friends;
}

export default resolver;
