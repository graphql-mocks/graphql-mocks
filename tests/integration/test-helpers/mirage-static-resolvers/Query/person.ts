import { QueryResolvers } from '../../types';

const resolver: QueryResolvers['person'] = function (_parent, args, context /*, _info*/) {
  const { mirageServer } = context.pack.dependencies;
  return mirageServer.schema.people.find(args.id);
};

export default resolver;
