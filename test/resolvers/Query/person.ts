import {QueryResolvers, Person} from '../../../types'
import {server, serialize} from '../../mirage';

const resolver: QueryResolvers["person"] = function(parent, args, context, info) {
  return serialize(server.schema.people.find(args.id));
}

export default resolver;
