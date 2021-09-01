---
id: introducing-network-handlers
title: Introducing Network Handlers
---

GraphQL is network-agnostic and works across any protocol where requests and responses can be sent and received. This agnostic flexibility extends to `graphql-mocks` allowing for portable mocks which can work in node.js, the browser, and can be integrated with different libraries that handle requests and responses.

Depending on the situation different network handling will be appropriate for your mocking use-case. To make things easier `graphql-mocks` provides packages to integrate with different network scenarios. These packages start with the `network` prefix (ie: `@graphql-mocks/network-*`).

## Supported Node Network Handlers

### Express
* `@graphql-mocks/network-express`
* [Documentation](/docs/network/express)

### Nock
* `@graphql-mocks/network-nock`
* [Documentation](/docs/network/nock)


## Supported Browser Network Handlers

*Browser network mocking coming soon*
