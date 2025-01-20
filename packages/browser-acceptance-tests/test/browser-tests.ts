import { expect } from 'chai';
import puppeteer, { Browser, Page } from 'puppeteer';
import { after } from 'mocha';

const acceptanceTests = (testKey: string, port: string) => {
  function tests(): void {
    let browser: Browser;
    let page: Page;

    after(async () => {
      console.log('test suite finished');

      if (browser) {
        console.log('closing browser');
        await browser.close();
      }
    });

    it(`[${testKey}] works in the browser with dummy-react-app`, async function () {
      this.timeout(1000 * 30);

      browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      page = await browser.newPage();
      await page.setJavaScriptEnabled(true);

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
      );

      await page.goto(`http://localhost:${port}?testKey=${testKey}`, {
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
  }

  return tests;
};

export const browserAcceptanceTests = acceptanceTests;
