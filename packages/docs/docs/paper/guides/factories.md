---
title: Generating Data with Factories
---

**Note: A better `factory` operation is in the works but while the api is being ironed out, this works as a great option that can be migrated later.**

The `create` operation in *Mutate Transaction* callback can be used with factory functions that return spreadable pojos.

For example if we wanted to create a factory for an `Actor` will the following fields:

```graphql
type Actor {
  firstName: String!
  lastName: String!
  city: String!
}
```

we could create a factory using the [Falso](https://github.com/ngneat/falso) package:

```js
import { randFirstName, randLastName, randCity } from '@ngneat/falso';

// alternatively the factory function could also take arguments
export function actorFactory() {
  return {
    firstName: randFirstName(),
    lastName: randLastName(),
    city: randCity(),
  };
}
```

Then the `actorFactory` can be used within a *Mutate Transaction* callback when creating an `Actor` using the `create` operation:

```js
import { actorFactory } from './factories/actor';

paper.mutate(({ create }) => {
  return create('Actor', {
    // spread the result of calling the factory function
    ...actorFactory(),

    // any overrides can be specified
    firstName: 'First Name Override'
  });
});
```
