import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function ApiLink({ directoryName, packageName }) {
  return (
    <a href={`/api/${directoryName}`}>
      <code>{packageName}</code>
    </a>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title="Home" description={siteConfig.tagline}>
      <div className="container">
        <header style={{ marginTop: '2rem' }}>
          <h1>API Documentation</h1>
        </header>
        <main>
          <h2>Packages:</h2>
          <ul>
            <li>
              <ApiLink directoryName="graphql-mocks" packageName="graphql-mocks" />
            </li>
            <li>
              <ApiLink directoryName="paper" packageName="graphql-paper" />
            </li>
            <li>
              <ApiLink directoryName="network-msw" packageName="@graphql-mocks/network-msw" />
            </li>
            <li>
              <ApiLink directoryName="network-nock" packageName="@graphql-mocks/network-nock" />
            </li>
            <li>
              <ApiLink directoryName="network-express" packageName="@graphql-mocks/network-express" />
            </li>
            <li>
              <ApiLink directoryName="sinon" packageName="@graphql-mocks/sinon" />
            </li>
            <li>
              <ApiLink directoryName="mirage" packageName="@graphql-mocks/mirage" />
            </li>
          </ul>
        </main>
      </div>
    </Layout>
  );
}

export default Home;
