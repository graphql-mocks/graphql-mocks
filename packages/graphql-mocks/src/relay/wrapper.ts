import { createWrapper } from '../resolver';
import { coerceToList } from '../resolver/utils';
import { isRelayConnectionField } from './is-relay-connection-field';
import { CursorForNode } from './types';
import { paginateNodes } from '.';
import { NamedWrapper } from '../resolver/types';

export const relayWrapper = ({
  cursorForNode,
  force,
}: {
  cursorForNode: CursorForNode<unknown>;
  force?: boolean;
}): NamedWrapper<'FIELD'> => {
  force = force ?? false;
  return createWrapper('relay-wrapper', 'FIELD', (resolver) => {
    return async (parent, args, context, info) => {
      const { fieldName, parentType } = info;
      const field = parentType.getFields()[fieldName];
      const isRelayPaginated = isRelayConnectionField(field);
      const result = await resolver(parent, args, context, info);

      if (force || isRelayPaginated) {
        const nodes = coerceToList(result);
        return nodes && paginateNodes(nodes, args, cursorForNode);
      }

      return result;
    };
  });
};
