import { ModelInstance } from 'miragejs';
import { ResolverParent, ResolverArgs, ResolverContext, ResolverInfo, FieldResolver } from '../types';
import { RouteHandler } from 'miragejs/server';
import { TypeReference, FieldReference } from '../highlight/types';

type AutoFieldResolverType = 'OBJECT' | 'ROOT_TYPE';

export type ModelName = string;
export type AttrName = string;
export type MirageAttrReference = [ModelName, AttrName];

export type TypeMap = {
  graphql: TypeReference;
  mirage: ModelName;
};

export type FieldMap = {
  graphql: FieldReference;
  mirage: MirageAttrReference;
};

export type FieldFilterResolver = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  results: any[],
  parent: Parameters<FieldResolver>[0],
  args: Parameters<FieldResolver>[1],
  context: Parameters<FieldResolver>[2],
  info: Parameters<FieldResolver>[3],
) => any; // eslint-disable-line @typescript-eslint/no-explicit-any

export type FieldFilterMap = {
  graphql: FieldReference;
  filter: FieldFilterResolver;
};

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
