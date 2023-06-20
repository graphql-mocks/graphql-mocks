---
id: playwright
title: Playwright
---

[Playwright](https://playwright.dev/) enables reliable end-to-end testing for modern web apps. It provides APIs to mock
and modify network traffic so that you can easily integrate `graphql-mocks` with Playwright using
`@graphql-mocks/network-playwright`.

## Installation

Install the `@playwright/test` and `@graphql-mocks/network-playwright` npm packages.

```bash
# npm
npm install --save-dev @playwright/test @graphql-mocks/network-playwright

# yarn
yarn add --dev @playwright/test @graphql-mocks/network-playwright

# pnpm
pnpm add --save-dev @playwright/test @graphql-mocks/network-playwright
```

## Usage

```typescript
import { GraphQLHandler } from 'graphql-mocks';
import { playwrightHandler } from '@graphql-mocks/network-playwright';
import graphqlSchema from './graphql-schema';

const graphqlHandler = new GraphQLHandler({
  dependencies: {
    graphqlSchema,
  },
});

test.beforeEach(async ({ page }) {
  await page.route('/graphql', playwrightHandler(graphqlHandler));
})
```

## Resolver Context

When using the `@graphql-mocks/network-playwright` network handler each resolver context has a `playwright` property
which contains the `request` and `route` from the Playwright route handler.

```js
function resolver(parent, args, context, info) {
  const { playwright } = context;
  // request and route from the Playwright route handler
  const { request, route } = playwright;
}
```
