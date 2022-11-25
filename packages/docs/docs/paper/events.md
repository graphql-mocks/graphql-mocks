---
id: events
title: Events
---

After a *Mutate Transaction* any relevant events will be dispatched followed by any events that have been queued. This is useful for responding to specific changes either from GraphQL Paper or custom events that might have been queued in a custom operation or by the *Mutate Transaction* itself using the `queueEvent` operation.
## Listening to Events

Events are available via the `events` property on the `Paper` instance which follow the [`EventTarget` pattern](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/EventTarget).

To listen for an event use `events.addEventListener` on a `Paper` instance, for example to listen for the `create` event.

```js
paper.events.addEventListener('create', (event) => {
 // do something with the `create` event
});
```

[`removeEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener) is also available to stop listening for an event for a particular listener.

## Library Events

The following events are provided by default from GraphQL Paper when a document is created, removed, or modified.

### `create`

When a document is created from a transaction a `create` event is dispatched with the following properties:

```
{
  // the current `DocumentStore`
  store,

  // the created `Document`
  document
}
```

### `remove`

```
{
  // the current `DocumentStore`
  store,

  // the removed `Document`
  document
}
```

### `modify`

```
{
  // the current `DocumentStore`
  store,

  // the modified `Document`
  document,

  // object with changes per property on the document
  changes
}
```

The `changes` property lists the changes per key, for example if `changedPropertyOnDocument` changed on the document the `changes` property would look:

```js
{
  changedPropertyOnDocument: {
    propertyName: 'changedPropertyOnDocument',
    value: 'current value of changedPropertyOnDocument',
    previousValue: 'previous value of changedPropertyOnDocument',
  }
}
```

## Dispatching Custom Events

Any instance of `Event` that is added either via [`queueEvent` operation](/docs/paper/mutating-data#queueevent) or in a custom operation and pushed to the [`eventQueue` array](/docs/paper/operations#operational-context) will be dispatched after the transaction is complete *and* after the library events have been dispatched first.
