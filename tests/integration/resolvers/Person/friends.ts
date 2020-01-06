import { Resolver } from "../../../../src/types";

const resolver: Resolver = function(parent/*, args, context, info*/) {
  return parent.friends.models;
}

export default resolver;
