import { ModelInstance } from 'miragejs';
import { ResolverParent, ResolverArgs, ResolverContext, ResolverInfo, Resolver } from '../types';
import { TypeName, FieldReference } from '../resolver-map/reference/field-reference';
import { RouteHandler } from 'miragejs/server';

type AutoFieldResolverType = 'OBJECT' | 'ROOT_TYPE';

export type ModelName = string;
export type AttrName = string;
export type MirageAttrReference = [ModelName, AttrName];

export type TypeMap = {
  graphql: TypeName;
  mirage: ModelName;
};

export type FieldMap = {
  graphql: FieldReference;
  mirage: MirageAttrReference;
};

export type FieldFilterResolver = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  results: any[],
  parent: Parameters<Resolver>[0],
  args: Parameters<Resolver>[1],
  context: Parameters<Resolver>[2],
  info: Parameters<Resolver>[3],
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
