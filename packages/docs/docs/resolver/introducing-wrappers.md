---
id: introducing-wrappers
title: Introducing Resolver Wrappers
---

A Resolver Wrapper in its most basic form is a function that receives a Resolver function and returns a Resolver function. The returned Resolver function wraps the original and allows the result to be extracted and conditionally extended.

Essentially, a Resolver Wrapper looks like:

```javascript
function (originalResolver, wrapperOptions) {
  return async function (parent, args, context, info) {
    console.log('Inside the wrapper resolver');

    // Awaiting the result of the original using the parameters
    // passed in from the wrapped resolver
    const result = await originalResolver(parent, args, context, info);

    console.log("Returning original resolver result", result);
    return result;
  }
}
```

The returned Resolver still receives the arguments, can manipulate them, and has access to the original resolver and its result while ultimately controlling what gets returned.

Resolver Wrappers help keep Resolver functions lean, letting them focusing on resolving data, while using the Wrappers to extend and add common functionality. What also increases the flexibility of Resolver Wrappers is how they can be applied to specific Resolvers using the _Highlight_ system using `embed`.

Resolver Wrappers can be used to introspect Resolvers at query time, add Authentication, conventional results filtering, add conditional responses and error scenarios, and much more. See the [Available Resolver Wrappers](/docs/resolver/available-wrappers), how to [Apply Resolver Wrappers](/docs/resolver/applying-wrappers), or look into the tools provided for [Creating Custom Wrappers](/docs/resolver/creating-wrappers).
