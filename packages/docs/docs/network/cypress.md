---
id: cypress
title: Cypress
---

[Cypress](https://cypress.io) is a free and open-source JavaScript testing framework for end-to-end, integration, and
component testing in the browser. It also provides an easy way for mocking and stubbing network requests and responses.

You can easily integrate `graphql-mocks` with cypress using `@graphql-mocks/network-cypress`.

## Installation

Install the `cypress` and `@graphql-mocks/network-cypress` npm packages.

```bash
# npm
npm install --save-dev cypress @graphql-mocks/network-cypress

# yarn
yarn add --dev cypress @graphql-mocks/network-cypress

# pnpm
pnpm add --save-dev cypress @graphql-mocks/network-cypress
```

## Usage

```typescript
import { GraphQLHandler } from 'graphql-mocks';
import { cypressHandler } from '@graphql-mocks/network-cypress';
import graphqlSchema from './graphql-schema';

const graphqlHandler = new GraphQLHandler({
  dependencies: {
    graphqlSchema,
  },
});

cy.intercept('POST', '/graphql', cypressHandler(graphqlHandler));
```

You can also create a custom command for mocking GraphQL requests APIs:

```typescript
// in cypress/support/commands.ts

// If you're useing typescript
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to mock GraphQL API.
       */
      mockGraphQLAPI(): Chainable<null>;
    }
  }
}

Cypress.Commands.add('mockGraphQLAPI', () => {
  // make sure to return the cy.intercept() command so that you can chain
  // other commands if needed
  return cy.intercept('POST', '/graphql', cypressHandler(graphqlHandler));
});
```

## Resolver Context

When using the `@graphql-mocks/network-cypress` network handler each resolver context has a `cypress` property which
contains the `request` from the cypress route handler.

```js
function resolver(parent, args, context, info) {
  const { cypress } = context;
  // request, from the cypress route handler
  const { request } = cypress;
}
```
