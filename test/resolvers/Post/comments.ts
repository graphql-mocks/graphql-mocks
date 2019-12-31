import {PostResolvers} from '../../../types';
import {schema, serialize} from '../../mirage';

const resolver: PostResolvers["comments"] = function(parent, args, context, info) {
  return serialize(schema.posts.find(parent.id).comments);
}

export default resolver;
