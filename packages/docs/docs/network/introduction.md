---
id: introduction
title: Introduction
---

GraphQL is network-agnostic and works across any protocol where a request can be sent and a response received. This agnostic flexibility extends to `graphql-mocks` allowing for portable mocks which can work in node.js, the browser, and can be integrated with different libraries to handle network requests.

Depending on the situation different network handling will be appropriate for your mocking use-case. To make things easier `graphql-mocks` provides packages to integrate with these different network scenarios. These packages start with the `network` prefix (ie: `@graphql-mocks/network-*`).

## Supported Node Network Handlers

### Nock
* `@graphql-mocks/network-nock`
* [Documentation](/docs/network/nock)


## Supported Browser Network Handlers

*Browser network mocking coming soon*