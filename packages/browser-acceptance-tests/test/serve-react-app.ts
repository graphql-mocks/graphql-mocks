import connect from 'connect';
import serveStatic from 'serve-static';
import { resolve } from 'path';

const REACT_APP_DIST = resolve(__dirname, '../build');

export function serveReactApp(port: string) {
  return new Promise((resolve) => {
    const server = connect()
      .use(serveStatic(REACT_APP_DIST))
      .listen(Number(port), () => {
        console.log(`Serving React App, listening on ${port}`);
        resolve(server.close.bind(server));
      });
  });
}
