---
id: validations
title: Validations
---

Validations are what keep the `DocumentStore` in check and maintain consistency after every transactions. The power in these validations is that they flexibly describe and define the set of rules to which the Document Store must up hold.

The default rules that enforce sensible defaults (see *Provided and Default Validators* section) for GraphQL and connections. If there are particular restrictions to your GraphQL API and its data then adding custom validators can be a way to enforce these rules (see the *Creating Custom Validator* sections).

Validations are provided by *Validators* which come in two flavors *Document Validators* and *Field Validators*. Which combination of validators that are used can be specificed and custom validators can be added, too.

The validators are located on a `Paper` instance under the [`validators` property](pathname:///api/paper/classes/Paper.html#validators):

```js
paper.validators = {
  document: [],
  field: [],
}
```

where the `document` property contains an array of Document Validators and the `field` property contains an array of Field validators. See the next section for the defaults the are provided for each.

## Provided and Default Validators


### [`documentPropertyExistsAsFieldOnTypeValidator`](pathname:///api/paper/modules/validators.html#documentPropertyExistsAsFieldOnTypeValidator)
* Type: Document Validator
* Included by default

Enforces that any property that exists on a document also exists on the GraphQL type

### [`listFieldValidator`](pathname:///api/paper/modules/validators.html#listFieldValidator)
* Type: Field Validator
* Included by default

Enforces that lists are represented by arrays or connections to other documents

### [`nonNullFieldValidator`](pathname:///api/paper/modules/validators.html#nonNullFieldValidator)
* Type: Field Validator
* Included by default

Enforces that non-fields are not null

### [`objectFieldValidator`](pathname:///api/paper/modules/validators.html#objectFieldValidator)
* Type: Field Validator
* Included by default

Enforces that a field represented by an object is an object

### [`scalarFieldValidator`](pathname:///api/paper/modules/validators.html#scalarFieldValidator)
* Type: Field Validator
* Included by default

Enforces that a field represented by a scalar is a scalar

[`uniqueIdFieldValidator`](pathname:///api/paper/modules/validators.html#uniqueIdFieldValidator)
* Type: Field
* Included by default

Enforces that a type with *one* ID field is unique amongst other documents of the same type

### Removing a Default Validator

Validators are functions that exist on the `Paper` instance under the `validators.document` or `validators.field` arrays for Document Validators or Field Validators, respectively. To remove a validator from an instance set the array to a new array with the validators excluded. 

In this example `uniqueIdFieldValidator` and `documentPropertyExistsAsFieldOnTypeValidator` are filtered out from being used by the instance of `Paper`.

```js
import {
  uniqueIdFieldValidator,
  documentPropertyExistsAsFieldOnTypeValidator
} from 'graphql-paper/validations';

const excludedValidators = [
  uniqueIdFieldValidator,
  documentPropertyExistsAsFieldOnTypeValidator
];

paper.validators.document = paper.validators.document.filter(
  validator => !excludedValidators.includes(validator)
);

paper.validators.field = paper.validators.field.filter(
  validator => !excludedValidators.includes(validator)
);
```

## Creating Custom Document Validators

* [Interface API](api/paper/interfaces/types.DocumentTypeValidator.html)

A Document Validator enforces validation at the document-level, for the field-level use a Field Validator (see below). Document Validators that implement the `DocumentTypeValidator` interface with an object that has `validate` function/method. If anything is found on the `Document` that is invalid the the `validate` method should thrown an `Error` or a class that extends `Error`.

```js
{
  function validate({
    type: GraphQLObjectType<any>,
    document: Document,
    graphqlSchema: GraphQLSchema,
    store: DocumentStore
  })
}
```
Available within `validate`:
* `document` represents the document being validated 
* `type` represents the `GraphQLType` of the document being validated
* `graphqlSchema` is an instance of the `GraphQLSchema`
* `store` is read-only version of the `DocumentStore`

## Creating Custom Field Validators

* [Interface API](/api/paper/interfaces/types.FieldValidator.html)

Field Validators that implement the `FieldValidator` interface with an object that has `validate` function/method and the `skipConnectionValue`, `skipNullValue` properties. If anything is found on the `Document` that is invalid the the `validate` method should thrown an `Error` or a class that extends `Error`. See the section below on *Adding a Custom Validator Function*. See the section below on *Adding a Custom Validator Function*.

```js
{
  skipConnectionValue: boolean;
  skipNullValue: boolean;

  function validate({
    graphqlSchema: GraphQLSchema,
    type: GraphQLObjectType,
    field: GraphQLField,
    document: Document,
    fieldName: string,
    fieldValue: any,
    fieldConnections: DocumentKey[] | undefined,
    store: DocumentStore
  })
}
```

* `skipConnectionValue` skips validation when the field is represented by a connected value on the document
* `skipNullValue` skips validation when the field is represented by a null or undefined value on the document

Available within `validate`:
* `document` represents the document being validated 
* `type` represents the `GraphQLType` of the document being validated
* `field` represents the `GraphQLField` of the document property being validated
* `fieldName` represents a string for the property on the document (and the field on the GraphQL type)
* `graphqlSchema` is an instance of the `GraphQLSchema`
* `fieldValue` represents the value of the field (keep in mind that the field might be have connections to other documents under `fieldConnections` in which case those would be the representative value when the property is accessed)
* `store` is read-only version of the `DocumentStore`
* `fieldConnections` is an array of document keys or undefined if none exist (in which case `fieldValue` is the representative value when the property is accessed)

## Adding a Custom Validator Function to `Paper`

To add a custom validator function to an instance of `Paper` import it and push it on to the corresponding `document` or `field` array depending on if it's a Document Validator or Field Validator, respectively.

```js
import { customFieldValidator, customDocumentValidator } from './custom-validators';

paper.validators.field.push(customFieldValidator);
paper.validators.document.push(customDocumentValidator);
```
