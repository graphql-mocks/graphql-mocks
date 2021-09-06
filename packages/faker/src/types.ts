import faker from 'faker';
import {
  ReplaceableResolverOption,
  HighlightableOption,
} from 'graphql-mocks/resolver-map/types';

export type Faker = typeof faker;

// https://newbedev.com/typescript-deep-keyof-of-a-nested-object
type Join<K, P> = K extends string | number ?
    P extends string | number ?
    // eslint-disable-next-line prettier/prettier
    `${K}${"" extends P ? "" : "."}${P}`
    : never : never;


// eslint-disable-next-line @typescript-eslint/ban-types
type Paths<T> = T extends object ?
    { [K in keyof T]: K extends string ?
        `${K}` | Join<K, Paths<T[K]>>
        : never
    }[keyof T] : never

export type FakerFieldOptions<K = Paths<Faker>> = {
  nullPercentage?: number;
  nullListPercentage?: number;
  listCount?: number | { min: number; max: number };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  possibleValues?: any[];
  fakerFn?: K;
};

export type FakerOptions = {
  fields?: {
    [type: string]: {
      [field: string]: FakerFieldOptions;
    };
  };
};

export type FakerMiddlewareOptions = FakerOptions & ReplaceableResolverOption & HighlightableOption;
