import * as falso from '@ngneat/falso';
import { ReplaceableResolverOption, HighlightableOption } from 'graphql-mocks/resolver-map/types';

export type Falso = typeof falso;

// https://newbedev.com/typescript-deep-keyof-of-a-nested-object
type Join<K, P> = K extends string | number
  ? P extends string | number
    ? // eslint-disable-next-line prettier/prettier
      `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

type Paths<T> = T extends object
  ? { [K in keyof T]: K extends string ? `${K}` | Join<K, Paths<T[K]>> : never }[keyof T]
  : never;

export type FalsoGeneratorOptions = {
  nullPercentage?: number;
  nullListPercentage?: number;
  listCount?: number | { min: number; max: number };
};

export type FalsoFieldOptions<K = Paths<Falso>> = FalsoGeneratorOptions & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  possibleValues?: any[];
  falsoFn?: K;
};

export type FalsoOptions = FalsoGeneratorOptions & {
  fields?: {
    [type: string]: {
      [field: string]: FalsoFieldOptions;
    };
  };
};

export type FalsoMiddlewareOptions = FalsoOptions & ReplaceableResolverOption & HighlightableOption;
