import { expect } from 'chai';
import { resolve } from 'path';
import { env } from 'process';
import puppeteer from 'puppeteer';
import execa from 'execa';

const processes: any[] = [];

function cleanUpProcesses() {
  processes.forEach((child) => {
    child.cancel();
  });
}

function dummyReactApp__yarn(args = '') {
  const reactAppDirectory = resolve(__dirname, './dummy-react-app');

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

describe('acceptance', function () {
  let browser: any;
  let page: any;

  before(async function () {
    this.timeout(1000 * 60 * 3);

    await dummyReactApp__yarn();
    await dummyReactApp__yarn('build');
    await dummyReactApp__yarn('serve');
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

    await page.goto('http://localhost:8080', {
      waitUntil: 'networkidle0',
    });

    await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });

    const payload = await page.$eval('#payload', (el: any) => el.textContent);
    expect(JSON.parse(payload)).to.deep.equal({
      data: {
        helloWorld: 'Hello !!!',
      },
    });
  });
});
