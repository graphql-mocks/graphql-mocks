import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    // eslint-disable-next-line no-undef
    window
      .fetch('/graphql', {
        method: 'POST',
        body: JSON.stringify({
          query: `
          query HelloWorld($ending: String!) {
            helloWorld(ending: $ending)
          }
          query IgnoreThisOperation($ending: String!) {
            ignoreThis: helloWorld(ending: $ending)
          }
        `,
          variables: {
            ending: '!!!',
          },
          operationName: 'HelloWorld',
        }),
      })
      .then((result) => result.json())
      .then((data) => setData(data));
  }, []);

  return <div id="payload">{JSON.stringify(data)}</div>;
}

export default App;
