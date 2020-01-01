import {QueryResolvers, Person} from '../../../types'

const resolver: QueryResolvers["person"] = function(parent, args, context, info) {
  const serialize = context.mirageSerialize;
  const server = context.mirageServer;

  return serialize(server.schema.people.find(args.id));
}

export default resolver;
