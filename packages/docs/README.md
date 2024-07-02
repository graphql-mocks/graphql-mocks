# Website

This website is built using [Docusaurus 2](https://v2.docusaurus.io/), a modern static website generator.

### Installation

From the **root directory of `graphql-mocks`**
```
$ pnpm install
```

In the `./documentation` directory
```
$ pnpm install
```

### Local Development

From the **root directory of `graphql-mocks`**
```
$ pnpm build-docs
```

`typedoc` is configured from the **root** directory and generates a required `website/sidebars.js` file.
Running `pnpm build-docs` from the **root** directory will drop `website/sidebars.js` and `docs/typedoc/*` markdown
needed for docusarus2 integration with typedoc generated API docs.

To start a local development server run in the `./documentation` directory
```
$ pnpm start
```
After building, this command will open up a browser window. Most changes are reflected live without having to restart the server.

### Build

From the **root directory of `graphql-mocks`**
```
$ pnpm build-docs
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.
It first runs `typedoc` to create the `website/sidebars.js` and `docs/typedoc/*` markdown files.

### Deployment

```
$ GIT_USER=<Your GitHub username> USE_SSH=true pnpm deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
