/* eslint-disable no-debugger */

import { createWrapper, WrapperFor } from '../resolver';
import { NamedWrapper } from '../resolver/types';

type DebuggerOptions = {
  before?: boolean;
  after?: boolean;
};

export function debuggerWrapper(
  { before: debuggerBefore, after: debuggerAfter }: DebuggerOptions = { before: true, after: true },
): NamedWrapper<'ANY'> {
  return createWrapper('debugger-wrapper', WrapperFor.ANY, function (originalResolver, _options) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async function (...args: [any, any, any, any]) {
      if (debuggerBefore) {
        // 👋 HELLO! You have been stopped at the
        // 🛑 BEFORE DEBUGGER
        debugger;
      }

      const result = originalResolver(...args);

      if (debuggerAfter) {
        // 👋 HELLO! You have been stopped at the
        // 🛑 AFTER DEBUGGER
        debugger;
      }

      return result;
    };
  });
}
