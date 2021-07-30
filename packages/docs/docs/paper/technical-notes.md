---
id: technical-notes
title: Technical Notes
---

## Storage & Immutability

GraphQL Paper uses `immer` under the hood to be able to handle changes and optimize sharing references in a reference tree for unchanged portions. `Document`s and `DocumentStore`s are considered stale-on-arrival which means they should not be directly edited. There are safeguards in place that try and prevent editing a document or store outside of a *Mutate Transaction*. Immutability also allows versions sharing the the same Document Key to be compared.

## Documents

Documents have a few hidden symboled properties that assist with tracking some internal state:

### Document Key
Document Keys are uniquely generated string at the time a document is created. It is an internal identifier or reference used by the library to be able to track and reference a document. This leaves any `ID` fields on a GraphQL type in "user land" although GraphQL Paper does provide a validator to check that `ID`s on fields are unique within a type.

### Connections

Connections for a document are stored as an array of document keys (strings).

### GraphQL Type Name

Documents are "typed" by a GraphQL type. This is registered when a document is created and should never change.

## Transaction Lifecycle

1. Call `mutate` with a *Mutate Transaction* callback
1. Any previous transactions are waited to finish, in order, before the provided the transaction can run
1. Expand connections so that properties references the appropriate connected documents
1. Run `beforeTransaction` hooks
1. Call the transaction callback using `immer`
1. Run `afterTransaction` hooks
1. Capture any returned documents as represented by their keys
1. Collapse connections so that references are stashed by their document key
1. Run validations on new version created by `immer`
1. Determine which events can be created by comparing new and old versions of the store
1. Dispatch store events and custom events
1. Set new version as the current
1. Push the new version on to the history
1. Return transaction captured keys as frozen Documents for the `mutate` call

## Connection Lookup, Expansion and Collapsing

When accessing Documents outside of a *Mutate Transaction* the documents are wrapped in a proxy to assist with lookups of connections and to prevent document properties from being mutated outside a *Mutate Transaction*. The proxy also has a reference to the copy of the store when the document is retrieved ensuring that any connections looked up will also be *frozen* at the same point in time.

Before a transaction can occur each document has its connections expanded from on the document properties from document keys to references to the other documents. If the field supports a GraphQL List type then the documents are represented as an array of Documents.

After a transaction any document properties that have references are collpased into an internal array for connections, being stored as document keys.

## `nullDocument`

Since GraphQL has a concept of nullable lists, that is lists that contain null, and connections are represented by documents there is a special reserved `nullDocument` used in storing lists that contain null. This is a special case and not something that normally crops up during average usage and is kept relatively hidden but would be important to consider when writing a custom validator that needs to check connections. During expansion of connections `nullDocuments` in lists are represented by `null` values and when collapsed the proxy ensures that any lists containing `nullDocuments` are represented by `null` also.

## Performance

Because GraphQL Paper handles everything "in memory" as javascript data structures it should be relatively quick for most use cases. If there is a case where it is slow please open an issue on github. There is some low-hanging fruit but also a desire to avoid early over optimization.
