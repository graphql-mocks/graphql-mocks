import {QueryResolvers} from '../../types'

const resolver: QueryResolvers["person"] = function(_parent, args, context, _info) {
  const {server} = context.mirage;
  return server.schema.people.find(args.id);
}

export default resolver;
