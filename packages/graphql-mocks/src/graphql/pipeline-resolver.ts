import { FieldResolver, TypeResolver } from '../types';

type PipelineOptions<T> = { before?: T[]; after?: T[] };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResolverResult = any;

export function createPipeline<T extends TypeResolver | FieldResolver>(
  pipeline: T,
  options: PipelineOptions<T>,
): _Pipeline<T> {
  return new _Pipeline<T>(pipeline, options) as _Pipeline<T>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function embedPipeResult(context: Record<string, unknown>, result: ResolverResult) {
  return { ...context, pipeline: { result } };
}

export class _Pipeline<T extends TypeResolver | FieldResolver> {
  coreResolver: T;
  before: T[];
  after: T[];

  constructor(resolver: T, pipelines: PipelineOptions<T>) {
    this.before = pipelines?.before ?? [];
    this.after = pipelines?.after ?? [];
    this.coreResolver = resolver;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.coreResolver.pipeline = this as _Pipeline<any>;
  }

  addBefore(...resolvers: T[]): void {
    this.before = [...resolvers, ...this.before];
  }

  addAfter(...resolvers: T[]): void {
    this.before = [...this.after, ...resolvers];
  }

  resolver = async (a: any, b: any, context: any, d: any): Promise<ReturnType<T>> => {
    if (typeof context !== 'object' || !(context instanceof Object)) {
      throw new Error('Passed context should be an object');
    }

    const pipeline = [...this.before, this.coreResolver, ...this.after];
    let resolver: FieldResolver | TypeResolver | undefined;
    let result: ResolverResult = undefined;

    while ((resolver = pipeline.shift())) {
      const embeddedContext = embedPipeResult(context, result);
      result = await resolver(a, b, embeddedContext, d);
    }

    return result;
  };
}
