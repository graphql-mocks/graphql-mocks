---
id: creating-wrappers
title: Creating Custom Wrappers
---

As previously shown, a Resolver Wrapper is a function that receives a Resolver and must return a Resolver. This design
allows for a returned Resolver function that wraps the original. The original resolver can be `await`ed for a result,
the arguments can be checked, changed, same with the final returned result.
The Generic Resolver Wrapper shows the basic concept but it is recommended to use the `createWrapper` function.

## `wrapperOptions`

Whether using `createWrapper` or the Generic Wrapper Function are passed `wrapperOptions`. `wrapperOptions` includes useful contextual details about the Resolver being wrapped. Including `wrapperOptions.type`
for the GraphQL type and `wrapperOptions.field` if it is wrapping a Field Resolver.

## `createWrapper`
* [API](pathname:///api/graphql-mocks/modules/resolver.html#createWrapper)

Using `createWrapper` helps by providing more context about the wrapper and includes the following benefits:
* The wrapper is named which helps in debugging through multiple wrappers
* The second argument will apply the right typescript typing for `originalResolver` and `wrapperOptions`
* There are runtime checks to ensure that the type specified by second argument match the resolver being wrapped

```js
import { createWrapper, WrapperFor } from 'graphql-mocks/resolver';

const wrapper = createWrapper('my-wrapper', WrapperFor.FIELD, function(originalResolver, wrapperOptions) {
  return (parent, args, context, info) {
    console.log('Inside the wrapper');

    // Awaiting the result of the original using the parameters
    // passed in from the wrapped resolver
    const result = await originalResolver(parent, args, context, info);

    console.log("Returning original resolver result", result);
    return result;
  };
});
```

### `createWrapper` Arguments

| Argument | From the Example | Description |
| --- | --- | --- |
| Name | `my-wrapper` | Provides the name of the wrapper
| WrapperFor | `WrapperFor.FIELD` | `WrapperFor.FIELD`, `WrapperFor.TYPE`, `WrapperFor.ANY`. The constant that specifies the type of Resolver the wrapper can apply to. `WrapperFor.ANY` can be used if the Wrapper can be used for both Type Resolvers and Field Resolvers.
| Wrapper Function | _see function in example_ | The Resolver Wrapper function. The `originalResolver` and `wrapperOptions` will be typed based on the `WrapperFor` constant. |


## Generic Resolver Wrapper
* [API](pathname:///api/graphql-mocks/modules/resolver.types.html#GenericWrapperFunction)

**Note: While this is a valid Resolver Wrapper Function it is recommended to use the [`createWrapper`](#createwrapper) for most cases**

```js
const wrapper = function (originalResolver, wrapperOptions) {
  return async function (parent, args, context, info) {
    console.log('Inside the wrapper');

    // Awaiting the result of the original using the parameters
    // passed in from the wrapped resolver
    const result = await originalResolver(parent, args, context, info);

    console.log("Returning original resolver result", result);
    return result;
  }
}
```

As we have seen in the [Using Resolver](/docs/resolver/using-resolvers) there are two types of Resolvers: Field
Resolvers and Type Resolvers. Both can be wrapped but it's important to note the arguments to these two Resolver
functions are different. Therefore, there are some Resolver Wrappers that can only be used for Field Resolvers, or Type Resolvers. To make this easier it is recommended to use the `createWrapper` helper which provides additional type checks and guards at runtime.
