---
id: introducing-network-handlers
title: Introducing Network Handlers
---

GraphQL is network-agnostic and works across any protocol where requests and responses can be sent and received. This flexibility extends to `graphql-mocks` allowing for writing mocks once and reusing them in node.js, the browser, and with any library that can handle requests and responses.

Depending on the situation different network handling will be appropriate for your mocking use-case. To make things easier `graphql-mocks` provides packages to integrate with different network scenarios. These packages start with the `network` prefix (ie: `@graphql-mocks/network-*`).

*More Network Handlers coming soon!*

## `localhost` Network Handlers

### `gqlmocks` cli
* `gqlmocks serve` command
* [Documentation](/docs/cli/commands/#gqlmocks-serve)

### Express
* `@graphql-mocks/network-express`
* [Documentation](/docs/network/express)

## Browser Network Handlers

### `msw` (mock service worker)
* `@graphql-mocks/network-msw`
* [Documentation](/docs/network/msw)

### Pretender
* `@graphql-mocks/network-pretender`
* [Documentation](/docs/network/pretender)

### Cypress
* `@graphql-mocks/network-cypress`
* [Documentation](/docs/network/cypress)

### Playwright
* `@graphql-mocks/network-playwright`
* [Documentation](/docs/network/playwright)

## Node Network Handlers

### Express
* `@graphql-mocks/network-express`
* [Documentation](/docs/network/express)

### Nock
* `@graphql-mocks/network-nock`
* [Documentation](/docs/network/nock)
