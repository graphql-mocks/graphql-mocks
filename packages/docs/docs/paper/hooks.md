---
id: hooks
title: Hooks
---

Hooks provide a way of accessing different points during a Mutate Transaction with the same [operations](/docs/paper/mutating-data#transaction-operations) that are available during the *Mutuate Transaction* itself.

The current hooks available are:
* `beforeTransaction` - Access operations, including the store (via `getStore` operation), before every provided transaction callback is called
* `afterTransaction` - Access operations after every transaction callback is finished

To create a hook provide a hook function, or async function:

```js
export const customBeforeTransactionHook = async ({ create, find, remove, clone, getStore, queueEvent }) {
  // custom hook logic here
};
```


Next, add the hook function on the paper instance under the relevant hook name, for example adding a `beforeTransaction` hook from the previous example:

```js
import { customBeforeTransactionHook } from './custom-hooks';

paper.hooks.beforeTransaction.push(customBeforeTransactionHook);
```

When an array of hook functions are ran they will be run serially, one after the other, waiting for async functions or returned promises to resolve.
