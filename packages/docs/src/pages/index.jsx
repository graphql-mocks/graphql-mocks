import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css';
import graphqlHandler from '../../code-examples/home/handler.source';

const defaultQuery = `{
  movies(name:"Mo") {
    name
    year
    characters {
      name
    }
  }
}`;

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title="Home" description={siteConfig.tagline}>
      <div className="container">
        <header className="hero">
          <img src="img/logo.svg" className={classnames('hero__logo')} />
          <div className="hero__content">
            <h1 className="hero__title">
              <code>{siteConfig.title}</code>
            </h1>
            <p className="hero__subtitle">{siteConfig.tagline}</p>
            <div>
              <Link
                className={classnames('button button--secondary button--lg', styles.getStarted)}
                to={useBaseUrl('docs/getting-started/introduction')}
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        <main>
          <ul className={classnames(styles.features, 'hero')}>
            <li className="feature">
              <h2 className="feature__heading">💪 Mock and Prototype GraphQL APIs</h2>
              <div className="feature__dot-grid"></div>
              <p>
                This library provides the tools to create mock GraphQL APIs or prototype on GraphQL Schema changes that
                might not exist yet. Use your mock GraphQL API in the browser or with any GraphQL API consumer.
              </p>
            </li>
            <li className="feature">
              <h2 className="feature__heading">🧑‍🎨 Create Declarative Abstractions</h2>
              <div className="feature__dot-grid"></div>
              <p>
                Use <a href="/docs/highlight/introducing-highlight">Highlight</a>,{' '}
                <a href="/docs/resolver/introducing-wrappers">Resolver Wrappers</a> and{' '}
                <a href="/docs/resolver-map/introducing-middlewares">Resolver Map Middlewares</a> to create and compose
                declarative abstractions. This makes it easier to paint a picture of your Mock API in the perfect state,
                ready to tweak and iterate.
              </p>
            </li>
            <li className="feature">
              <h2 className="feature__heading">🧑‍🔬 Test better</h2>
              <div className="feature__dot-grid"></div>
              <p>
                <code>graphql-mocks</code> is aimed to helping you test better, too. Whether you want to log what is
                happening in your queries during local development, spy on your Resolvers with Sinon JS, or assert
                against state from running queries against the handler, graphql-mocks helps make it easier.
              </p>
            </li>
            <li className="feature">
              <h2 className="feature__heading">👀 Take a look!</h2>
              <div className="feature__dot-grid"></div>
              <p>To quickly show a few of the features in action here we have:</p>
              <ul>
                <li>Setting up a GraphQL query handler and making a query</li>
                <li>
                  Using the <code>@graphql-mocks/mirage</code> package and its middleware to mock stateful queries (try
                  a mutation and see the change persist in subsequent queries)
                </li>
                <li>
                  An embedded <code>logWrapper</code> <em>highlighted on all</em> root-level Query resolvers for logging
                </li>
              </ul>
              <div className={styles['no-servers-warning']}>
                ⚠️ Warning: <strong>No servers</strong> are harmed, or used, in the resolving of these GraphQL queries
              </div>
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
                  fetcher={(data) => {
                    return graphqlHandler.query(data.query).then((result) => {
                      return result;
                    });
                  }}
                ></GraphiQL>
              </div>
              <SyntaxHighlighter
                className={` ${styles['banner-code']} ${styles['yellow-outline']} `}
                language="javascript"
              >
                {`
// 1. Setup your handler with a resolver map, middlewares,
// and wrappers as needed

const handler = new GraphQLHandler({
  // optionally, provide a base resolver map
  resolverMap,

  // use middlewares from packages, make your own,
  // and embed resolver wrappers
  middlewares: [
    mirageMiddleware(),

    embed({
      // Highlight callbacks makes it easy to declaratively
      // select what should be wrapped with the \`logWrapper\`
      highlight: (h) => h.include(field(['Query', '*']))
      wrappers: [logWrapper],
    }),
  ]

  // fun fact: dependencies are available in any resolver with
  // the \`extractDependencies\` utility function
  dependencies: {
    graphqlSchema,
  },
});


// 2. Run queries!

handler.query(\`
  query {
    ...
  }
\`).then(result => console.log(result));
          `}
              </SyntaxHighlighter>
            </li>
          </ul>
        </main>
      </div>
    </Layout>
  );
}

export default Home;
