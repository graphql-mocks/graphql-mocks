---
id: quick-mocking
title: Quick Mocking with Serve
---

Using the `gqlmocks serve` command is the fastest way to get mocking only a GraphQL Schema.

The `serve` command provides:
* Running server at `localhost`
* A graphiql ide for browsing the schema 
* Automatic remote schema fetching with the `--schema` flag
* Bundled faker middleware for automatic mocking

See the [gqlmocks command documentation](/docs/cli/commands) for more information and available flags.

## Local Server

Having a mock GraphQL Server available at `localhost` is valuable for testing against other GraphQL tools and integrating with other locally running services.

```
npx gqlmocks serve --schema https://s3.aws/schema.graphql --faker
Fetching schema from https://s3.aws/schema.graphql... done
Starting graphql api server on port 4444... done

 Local GraphQL API:  http://localhost:4444/graphql
 IDE client:         http://localhost:4444/client

Press Ctrl+C to stop
```

## Local IDE

The provided the `/client` path available on the server provides a fully running GraphiQL IDE.

![Screenshot of GraphiQL IDE](/img/cli-graphiql.png)

## Fast Mocking with Remote Schema and Faker

The fastest way to mocking a GraphQL API without any setup is to use the faker middleware and specifying a remote url to a GraphQL Schema file or remote GraphQL API. The faker middleware will handle 

```
# Fetching schema from a running GraphQL API server
npx gqlmocks serve --faker --schema "http://remote-api.com/graphql"

# Fetching .graphql file from url
npx gqlmocks serve --faker --schema "http://s3.aws.com/schema.graphql"
```

Additional `--header` flags can be used to specify any headers required to fetch the remote schema.

## Using `serve` with a Local Handler or Config

If a more refined mocking is setup locally the `gqlmocks serve` command will look for a local project config file to serve. Additionally a specific handler or config file can be served with the `--handle` and `--config` flags respectively.