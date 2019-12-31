import {CommentResolvers} from '../../../types';
import {schema, serialize} from '../../mirage';

const resolver: CommentResolvers["author"] = function(parent, args, context, info) {
  return serialize(schema.comments.find(parent.id).author);
}

export default resolver;
