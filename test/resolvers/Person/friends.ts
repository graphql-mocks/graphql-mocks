import {PersonResolvers} from '../../../types';

const resolver: any = function(parent: any/*, args, context, info*/) {
  debugger;
  return parent.friends.models;
}

export default resolver;
