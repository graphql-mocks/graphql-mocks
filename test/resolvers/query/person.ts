import {QueryResolvers, Person} from '../../../types'
import {server} from '../../mirage';

const resolver: QueryResolvers["person"] = function(parent, args, context, info) {
  return server.schema.people.find(args.id);
}

export default resolver;
