import {PostResolvers} from '../../../types';
import {schema, serialize} from '../../mirage';

const resolver: PostResolvers["author"] = function(parent, args, context, info) {
  return serialize(schema.posts.find(parent.id).author);
}

export default resolver;
