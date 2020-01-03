import {QueryResolvers, Person} from '../../../types'

const resolver: QueryResolvers["person"] = function(parent, args, context, info) {
  const {server} = context.mirage;
  return server.schema.people.find(args.id);
}

export default resolver;
