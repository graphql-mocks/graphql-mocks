import { isObjectType } from 'graphql';
import { unwrap } from '../graphql/type-utils';
import { ObjectField } from '../types';

export function isRelayConnectionField(field: ObjectField): boolean {
  const rawType = unwrap(field.type);

  if (!isObjectType(rawType) || (isObjectType(rawType) && !rawType.getFields()?.edges)) {
    return false;
  }

  const relayArgNames = ['first', 'last', 'before', 'after'];
  const foundRelayArgs = field.args.filter((arg) => relayArgNames.includes(arg.name));

  return foundRelayArgs.length === relayArgNames.length;
}
