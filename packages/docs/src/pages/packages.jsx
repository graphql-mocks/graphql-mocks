import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function Package({ directoryName, packageName, apiDocsHref }) {
  apiDocsHref = apiDocsHref ?? `/api/${directoryName}`;

  return (
    <>
      <td>
        <a href={`https://www.npmjs.com/package/${packageName}`}>
          <code>{packageName}</code>
        </a>
      </td>
      <td>
        <a href={`https://github.com/graphql-mocks/graphql-mocks/tree/main/packages/${directoryName}`}>
          <code>/packages/{directoryName}</code>
        </a>
      </td>
      <td>{apiDocsHref ? <a href={apiDocsHref}>API</a> : 'none'}</td>
    </>
  );
}

function Packages() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title="Home" description={siteConfig.tagline}>
      <div className="container">
        <header style={{ marginTop: '2rem' }}>
          <h1>Packages &#38; API</h1>
        </header>
        <main>
          <table>
            <thead>
              <tr>
                <td>Package Name</td>
                <td>Package Source</td>
                <td>API Documentation</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Package directoryName="graphql-mocks" packageName="graphql-mocks" />
              </tr>
              <tr>
                <Package directoryName="paper" packageName="graphql-paper" />
              </tr>
              <tr>
                <Package directoryName="network-msw" packageName="@graphql-mocks/network-msw" />
              </tr>
              <tr>
                <Package directoryName="network-pretender" packageName="@graphql-mocks/network-pretender" />
              </tr>
              <tr>
                <Package directoryName="network-nock" packageName="@graphql-mocks/network-nock" />
              </tr>
              <tr>
                <Package directoryName="network-express" packageName="@graphql-mocks/network-express" />
              </tr>
              <tr>
                <Package directoryName="cli" packageName="gqlmocks" apiDocsHref="/docs/cli/commands" />
              </tr>
              <tr>
                <Package directoryName="falso" packageName="@graphql-mocks/falso" />
              </tr>
              <tr>
                <Package directoryName="sinon" packageName="@graphql-mocks/sinon" />
              </tr>
              <tr>
                <Package directoryName="mirage" packageName="@graphql-mocks/mirage" />
              </tr>
            </tbody>
          </table>
        </main>
      </div>
    </Layout>
  );
}

export default Packages;
