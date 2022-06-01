import { expect } from 'chai';
import { execSync } from 'child_process';
import { resolve } from 'path';
import { env } from 'process';
import puppeteer, { Browser, Page } from 'puppeteer';
import execa from 'execa';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processes: any[] = [];

function cleanUpProcesses() {
  processes.forEach((child) => {
    child.cancel();
  });

  // additional aggressive clean up for the grandchildren of server processes
  try {
    execSync(`kill $(ps aux | grep -i "http-server" | awk '{print $2}')`);
  } catch {
    // noop
  }
}

export function dummyReactApp__yarn(packageRoot: string, args = '') {
  const reactAppDirectory = resolve(packageRoot, 'dummy-react-app');

  console.log(`spawning yarn with ${args}`);

  const process = execa('yarn', ['--no-lockfile', '--cwd', reactAppDirectory, ...args.split(' ')], {
    env: { DISABLE_ESLINT_PLUGIN: 'true', SKIP_PREFLIGHT_CHECK: 'true', BROWSER: 'none', PATH: env.PATH },
  });

  processes.push(process);
  let data = '';

  return new Promise((resolve, reject) => {
    process.on('error', reject);
    process.on('exit', resolve);
    process.on('close', resolve);

    process?.stdout?.on('data', (chunk) => {
      data += chunk.toString();
      console.log(chunk.toString());

      if (data.includes('Available on')) {
        resolve(data);
      }

      if (data.includes('Compiled with warnings')) {
        resolve(data);
      }

      if (data.includes('Failed to compile')) {
        reject(data);
      }
    });
  });
}

const acceptanceTests = (packageRoot: string, port: string) =>
  function () {
    let browser: Browser;
    let page: Page;

    before(async function () {
      this.timeout(1000 * 60 * 3);
      await dummyReactApp__yarn(packageRoot);
      await dummyReactApp__yarn(packageRoot, 'build');
      await dummyReactApp__yarn(packageRoot, 'serve');
    });

    after(async () => {
      console.log('test suite finished');

      if (browser) {
        console.log('closing browser');
        await browser.close();
      }

      console.log('cleaning up processes');
      cleanUpProcesses();
    });

    it('works in the browser with dummy-react-app', async function () {
      this.timeout(1000 * 60);

      browser = await puppeteer.launch();
      page = await browser.newPage();
      await page.setJavaScriptEnabled(true);

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
      );

      await page.goto(`http://localhost:${port}`, {
        waitUntil: 'networkidle0',
      });

      await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });

      const payload = await page.$eval('#payload', (el: Element) => el.textContent);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(JSON.parse(payload!)).to.deep.equal({
        data: {
          helloWorld: 'Hello !!!',
        },
      });
    });
  };

// this should be used in any browser acceptance tests that implement
export const browserAcceptanceTests = acceptanceTests;
