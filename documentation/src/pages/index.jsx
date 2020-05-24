/* eslint-disable import/no-unresolved */
import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import graphqlHandler from '../../code-examples/home/handler.source';

// for mdx to work the following import is required so that it's included in the
// bundle
import { mdx } from '@mdx-js/react';
import HandlerSource from 'code-examples/home/handler.source.md';

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
          <Tabs
            style={{ minHeight: '600px' }}
            defaultValue="editor"
            values={[
              { label: 'Live', value: 'editor' },
              { label: 'Source', value: 'source' },
            ]}
          >
            <TabItem value="editor">
              <center>
                <em>
                  ⚠️ Warning: <strong>No servers</strong> are used in the resolving of these GraphQL queries
                </em>
              </center>
              <div style={{ height: '600px' }}>
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
                  defaultQuery={`{
  film(name:"Mons") {
    name
    characters {
      name
    }
  }
}`}
                  docExplorerOpen={false}
                  fetcher={(data) => {
                    return graphqlHandler.query(data.query).then((result) => {
                      return result;
                    });
                  }}
                ></GraphiQL>
              </div>
            </TabItem>
            <TabItem value="source">
              <HandlerSource />
            </TabItem>
          </Tabs>
          <ul className={classnames(styles.features, 'hero')}>
            <li className="feature feature--left">
              <h2 className="feature__heading">1. Mock GraphQL APIs</h2>
              <div className="feature__dot-grid"></div>
              <p>
                Mocking your GraphQL API starts with your Resolvers. This library provides the tools to help you
                bootstrap and extend the Resolvers in your Resolver Map. It also includes out-of-the-box helpers for
                relay pagination and setting up stateful queries via Mirage JS.
              </p>
            </li>
            <li className="feature feature--left">
              <h2 className="feature__heading">2. Reuse Setup</h2>
              <div className="feature__dot-grid"></div>
              <p>
                The Resolver Wrappers and Resolver Map Middlewares compose to create abstractions that make it easier to
                combine and re-use for the various states of your GraphQL API. This is especially useful when you are in
                a test scenario and your cases may change from test to test.
              </p>
            </li>
            <li className="feature feature--left">
              <h2 className="feature__heading">3. Leverage Test Utilities</h2>
              <div className="feature__dot-grid"></div>
              <p>
                <code>graphql-mocks</code> is aimed to help you test better, whether you want to log what is happening
                throughout the execution of your query , spy on your Resolvers with Sinon JS, or extract common state
                for test assertions.
              </p>
            </li>
          </ul>
        </main>
      </div>
    </Layout>
  );
}

export default Home;
