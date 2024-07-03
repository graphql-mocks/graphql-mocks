import { createWrapper, WrapperFor } from '../resolver';
import { NamedWrapper } from '../resolver/types';

type LatencyInMs = number;
type Latency = LatencyInMs | [LatencyInMs, LatencyInMs];

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.round(Math.random() * (max - min) + min);
}

async function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function latencyWrapper(latency: Latency = 0): NamedWrapper<'ANY'> {
  const finalLatency = Array.isArray(latency) ? getRandomInt(latency[0], latency[1]) : latency;

  return createWrapper('latency-wrapper', WrapperFor.ANY, function (originalResolver) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async function (...args: [any, any, any, any]) {
      await wait(finalLatency);
      return originalResolver(...args);
    };
  });
}
