import { Maybe } from 'graphql/jsutils/Maybe';
import { TypeResolver, FieldResolver } from '../../src/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function callResolver<T extends TypeResolver | FieldResolver>(
  resolver: Maybe<T>,
  args: any[] = [{}, {}, {}, {}],
): ReturnType<T> {
  if (!resolver) {
    throw new Error(`No resolver function passed into test helper callResolver, got ${typeof resolver}`);
  }

  return resolver(args[0], args[1], args[2], args[3]);
}
