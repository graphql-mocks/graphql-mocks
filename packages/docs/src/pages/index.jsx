import SyntaxHighlighter from 'react-syntax-highlighter';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css';

const defaultQuery = `{
  movies(name:"Mo") {
    name
    year
    characters {
      name
    }
  }
}`;

// eslint-disable-next-line @typescript-eslint/no-empty-function, valid-typeof
let Handler = typeof window === 'undefined' ? () => {} : import('../../code-examples/home/handler.source');

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title="Home" description={siteConfig.tagline}>
      <div className="container">
        <header className="hero-container">
          <div className="hero__content">
            <h1 className="hero__title">
              <code>{siteConfig.title}</code>
            </h1>
            <div className="hero__content-tagline">
              <strong>Build web applications today against the GraphQL APIs of tomorrow.</strong>
              <br />
              Setup once. Run in node, the browser, and <code>localhost</code> with tools that scale mocks with the
              complexity of your GraphQL API.
            </div>
            <div>
              <Link
                className={classnames('button button--secondary button--lg', styles.getStarted)}
                to={useBaseUrl('docs/getting-started/introduction')}
              >
                Get Started
              </Link>
            </div>
          </div>
          <div className="hero__slices">
            <section className="hero__slice">
              <img src="img/highlight.svg" className={classnames('hero__logo')} />
              <h2>Highlight</h2>
              <p>
                Use{' '}
                <a href="/docs/highlight/introducing-highlight">
                  <code>Highlight</code>
                </a>{' '}
                to flexibly select parts of the schema to mock and modify
              </p>
            </section>
            <section className="hero__slice">
              <img src="img/logo.svg" className={classnames('hero__logo')} />
              <h2>Mock</h2>
              <p>
                Flexibly define resolver behavior with <a href="/docs/resolver/introducing-wrappers">wrappers</a> and{' '}
                <a href="/docs/resolver-map/introducing-middlewares">middlewares</a> to cover even the most complex
                mocking scenarios
              </p>
            </section>
            <section className="hero__slice">
              <img src="img/paper.svg" className={classnames('hero__logo')} />
              <h2>Store</h2>
              <p>
                Persist mutations and control stateful data with a{' '}
                <a href="/docs/paper/introducing-paper">
                  <code>graphql-paper</code>
                </a>{' '}
                in-memory store
              </p>
            </section>
            <section className="hero__slice hero__slice-resolve">
              <img src="img/graphql-handler.png" className={classnames('hero__logo')} />
              <h2 className="__pull">Resolve</h2>
              <p>
                Resolve GraphQL queries in Node and the Browser with the provided{' '}
                <a href="/docs/handler/introducing-handler">
                  <code>GraphQLHandler</code>
                </a>
              </p>
            </section>
            <section className="hero__slice">
              <img src="img/network-handlers.png" className={classnames('hero__logo')} />
              <h2>Network</h2>
              <p>
                Write once, use everywhere. <a href="/docs/network/introducing-network-handlers">Network Handlers</a>{' '}
                bring your mocks to node, the browser, and more.
              </p>
            </section>
            <section className="hero__slice">
              <img src="img/gqlmocks-cli.png" className={classnames('hero__logo')} />
              <h2>CLI</h2>
              <p>
                Use the{' '}
                <a href="/docs/cli/introducing-gqlmocks">
                  <code>gqlmocks</code>
                </a>{' '}
                CLI to fetch remote schemas, generate boilerplate and{' '}
                <a href="/docs/cli/quick-mocking">
                  run mock servers on <code>localhost</code>
                </a>
                .
              </p>
            </section>
          </div>
        </header>

        <main>
          <div className="demo">
            <h2 className="feature__heading">Demo</h2>
            <div className="feature__dot-grid"></div>
            <p>
              ⚠️ Warning: <strong>No servers</strong> are used, or harmed, in the resolving of these GraphQL queries
            </p>
            <p>To quickly show a few of the features in action here we have:</p>
            <ul>
              <li>Setting up a GraphQL query handler and making a query</li>
              <li>
                Using <code>graphql-paper</code> package, an in-memory graphql store, which allows stateful queries (try
                a mutation and see the change persist in subsequent queries)
              </li>
              <li>
                An embedded <code>logWrapper</code> highlighted on <em>all root-level Query resolvers</em> for logging.
                Check the developer console for helpful logging after each query run.
              </li>
            </ul>
            <p>Go ahead and do a few queries and mutations (see changes persist)</p>
            <div className={styles['yellow-outline']} style={{ height: '400px' }}>
              <GraphiQL
                storage={{
                  removeItem() {
                    'noop';
                  },
                  getItem() {
                    'noop';
                  },
                  setItem() {
                    'noop';
                  },
                }}
                query={defaultQuery}
                docExplorerOpen={false}
                fetcher={async (data) => {
                  let graphqlHandler = (await Handler).createHandler();
                  return graphqlHandler.query(data.query).then((result) => {
                    return result;
                  });
                }}
              ></GraphiQL>
            </div>
            <h2>The Code</h2>
            <SyntaxHighlighter
              className={` ${styles['banner-code']} ${styles['yellow-outline']} `}
              language="javascript"
            >
              {`
// 1. Setup your handler

const handler = new GraphQLHandler({
  // optionally, provide a base resolver map
  resolverMap,

  // use middlewares from packages, make your own,
  // and embed resolver wrappers
  middlewares: [
    embed({
      // Highlight makes it easy to declaratively select
      // what resolvers should be wrapped with the \`logWrapper\`
      highlight: (h) => h.include(field(['Query', '*']))
      wrappers: [logWrapper],
    }),
  ]

  // add dependencies needed by middlewares or resolvers
  dependencies: {
    graphqlSchema,
    paper: new Paper(graphqlSchema)
  },
});


// 2. Run queries (or mutations)!

handler.query(\`
  query {
    ...
  }
\`);
          `}
            </SyntaxHighlighter>
          </div>
        </main>
      </div>
    </Layout>
  );
}

export default Home;
