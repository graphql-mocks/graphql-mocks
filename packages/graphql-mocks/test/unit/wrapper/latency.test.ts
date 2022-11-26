import { latencyWrapper } from '../../../src/wrapper';
import { SinonSpy, spy } from 'sinon';
import { expect } from 'chai';

class Timer {
  startTime: number | null = null;
  stopTime: number | null = null;

  start() {
    if (this.startTime) {
      throw new Error('start already called');
    }

    this.startTime = Date.now();
  }

  stop() {
    if (this.stopTime) {
      throw new Error('stop already called');
    }

    this.stopTime = Date.now();
  }

  get elapsed() {
    if (!this.startTime) {
      throw new Error('start has not been called');
    }

    if (!this.stopTime) {
      throw new Error('stop has not been called');
    }

    return Math.floor(this.stopTime - this.startTime);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const anyArg: any = {};

describe('wrapper/latency', function () {
  let timer: Timer;
  let resolverSpy: SinonSpy;

  beforeEach(function () {
    timer = new Timer();
    resolverSpy = spy();
  });

  it('delays for a specific amount of milliseconds', async function () {
    const latency = 1000;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrappedResolver = await latencyWrapper(latency).wrap(resolverSpy, {} as any);
    timer.start();
    await wrappedResolver(anyArg, anyArg, anyArg, anyArg);
    timer.stop();
    expect(timer.elapsed).to.be.greaterThan(latency - 10);
    expect(timer.elapsed).to.be.lessThan(latency + 10);
    expect(resolverSpy.calledWithExactly(anyArg, anyArg, anyArg, anyArg)).to.be.true;
  });

  it('delays for a range of milliseconds', async function () {
    const latency: [number, number] = [1000, 1500];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrappedResolver = await latencyWrapper(latency).wrap(resolverSpy, {} as any);
    timer.start();
    await wrappedResolver(anyArg, anyArg, anyArg, anyArg);
    timer.stop();
    expect(timer.elapsed).to.be.greaterThan(latency[0] - 10);
    expect(timer.elapsed).to.be.lessThan(latency[1] + 10);
    expect(resolverSpy.calledWithExactly(anyArg, anyArg, anyArg, anyArg)).to.be.true;
  });
});
