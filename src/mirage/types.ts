import { ModelInstance } from 'miragejs';
import { RouteHandler } from 'miragejs/server';
import { ResolverParent, ResolverArgs, ResolverContext, ResolverInfo, FieldResolver } from '../types';

type AutoFieldResolverType = 'OBJECT' | 'ROOT_TYPE';

export type FieldFilterResolver = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  results: any[],
  parent: Parameters<FieldResolver>[0],
  args: Parameters<FieldResolver>[1],
  context: Parameters<FieldResolver>[2],
  info: Parameters<FieldResolver>[3],
) => any; // eslint-disable-line @typescript-eslint/no-explicit-any

export type AutoResolverErrorMeta = {
  autoResolverType: AutoFieldResolverType;
  parent: ResolverParent;
  args: ResolverArgs;
  context: ResolverContext;
  info: ResolverInfo;
  match?: ObjectResolverMatch | RootQueryResolverMatch;
  isRelay?: boolean;
  hasFieldFilter?: boolean;
  usedFieldFilter?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result?: any;
};

export type ObjectResolverMatch = {
  fieldNameCandidates: string[];
  parentModelName?: string;
  matchedModelName?: string;
  matchedProperty?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  propertyValue?: any;
};

export type RootQueryResolverMatch = {
  models: ModelInstance[];
  modelNameCandidates: string[];
  matchedModelName?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MirageRouteHandler = RouteHandler<any>;
