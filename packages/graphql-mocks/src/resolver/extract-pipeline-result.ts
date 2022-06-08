import { ResolverContext } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractPipelineResult(context: ResolverContext): any {
  return { result: context?.pipeline?.result };
}
