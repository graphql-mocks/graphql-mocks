---
title: Create Custom Highlighters
---

Highlighters return highlighted [References](/docs/highlight/introducing-highlight#references), that is an array of either [Type References](/api/graphql-mocks/modules/highlight.types.html#TypeReference) or [Field References](/api/graphql-mocks/modules/highlight.types.html#FieldReference), for a given schema. There are already a number of useful highlighters provided by graphql-mocks out-of-the-box.

A highlighter must conform to the [`Highlighter` interface](/api/graphql-mocks/interfaces/highlight.types.Highlighter.html). This interface is simply a `mark` function on an object:
```
{
  mark(schema: GraphQLSchema): Reference[]
}
```

## Stateless Highlighters

The simplest highlighter to create is one that does not have any state, which can simply be a POJO that conforms to the `Highlighter` interface.

```js
const customHighlighter = {
  mark(schema) {
    // return an array of highlighted References
    return [];
  }
}
```

If there are options to the highlighter consider using a function factory:

```js
export const customHighlighter = (options) => {
  // make use of `options` in scope
  return {
    mark(schema) {
      // return an array of highlighted References
      return [];
    }
  }
}
```

## Stateful Highlighters

If a highlighter needs to hold on to state it's useful to create a class that implements the `Highlighter` interface, like many of the highlighters provided out-of-the-box, with additional state can be kept on class properties.

```js
import { Highlighter } from 'graphql-mocks/highlight/types';

class CustomHighlighter implements Highlighter {
  constructor(/* relevant options*/) {
  }

  // required `mark` method
  mark(schema) {
    // return an array of highlighted References
    return [];
  }
}
```

Generally, by design highlighters if there are options to a Highlighter for a constructor it's easier to provide a factory function to pass along and construct the instance. For example, continuing with the `CustomHighlighter` class above:

```js
export const customHighlighter = (options) => new CustomHighlighter(options);
```

While minimal it provides a more ergonomic API without have to `new` each Highlighter for use.

```js
hi(graphqlSchema).include(
  customHighlighter({ /* options */ })
);
```

## Highlight All

If a highlighter has the notion of "highlight all", by convention, it's useful to consider these these two cases:
* Use the `HIGHLIGHT_ALL` constant as an option
* If possible, calling the highlighter without arguments, provides the highlight all case
