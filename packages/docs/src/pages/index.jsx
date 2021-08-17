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
          <div className="hero__content">
            <h1 className="hero__title">
              <code>{siteConfig.title}</code>
            </h1>
            <p className="hero__subtitle">{siteConfig.tagline}</p>
          </div>
          <div className="hero__slices">
            <section className="hero__slice">
              <img src="img/highlight.svg" className={classnames('hero__logo')} />
              <h2>Highlight</h2>
              <p>
                Use <code>Highlight</code> to flexibly select parts of the schema to operate on
              </p>
            </section>
            <section className="hero__slice">
              <img src="img/logo.svg" className={classnames('hero__logo')} />
              <h2>Mock</h2>
              <p>Declaratively mock resolvers using wrappers and middlewares to cover various scenarios</p>
            </section>
            <section className="hero__slice">
              <img src="img/paper.svg" className={classnames('hero__logo')} />
              <h2>Store</h2>
              <p>
                Persist mutations and control stateful data with a <code>graphql-paper</code> in-memory store
              </p>
            </section>
          </div>
          <div className="hero__content">
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
                An embedded <code>logWrapper</code> <em>highlighted on all</em> root-level Query resolvers for logging
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
                fetcher={(data) => {
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
