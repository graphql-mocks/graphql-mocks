import React from 'react';

export function GraphQLResult(props) {
  return (
    <>
    <strong>Result: </strong>
    <pre className="graphql-result">
      { JSON.stringify(props.result, null, 2) }
    </pre>
    </>
  );
}
