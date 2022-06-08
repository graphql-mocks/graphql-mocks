import { FieldResolver, TypeResolver } from '../types';

type PipelineOptions<T> = { pipelines: { before?: T[]; after?: T[] } };

export function createPipeline<T extends TypeResolver | FieldResolver>(resolverpipeline: T[]): Pipeline<T> {
  return new Pipeline(pipeline);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function embedPipeResult(context: Record<string, unknown>, result: any) {
  return { ...context, pipeline: { result } };
}

class Pipeline<T extends TypeResolver | FieldResolver> {
  coreResolver: T;
  before: T[];
  after: T[];

  constructor(resolver: T, pipelines: { before?: T[]; after?: T[] }) {
    this.before = pipelines?.before ?? [];
    this.after = pipelines?.after ?? [];
    this.coreResolver = resolver;
    (this.resolver as any).pipeline = this;
  }

  addBefore(...resolvers: T[]) {
    this.before = [...resolvers, ...this.before];
  }

  addAfter(...resolvers: T[]) {
    this.before = [...this.after, ...resolvers];
  }

  resolver = async (a: any, b: any, context: any, d: any): Promise<ReturnType<T>> => {
    if (typeof context !== 'object' || !(context instanceof Object)) {
      throw new Error('Passed context should be an object');
    }

    const pipeline = [...this.before, this.coreResolver, ...this.after];
    let resolver: FieldResolver | TypeResolver | undefined;
    let result: any = undefined;
    while ((resolver = pipeline.shift())) {
      const embeddedContext = embedPipeResult(context, result);
      result = await resolver(a, b, embeddedContext, d);
    }

    return result;
  };
}
