import { GraphQLSchema } from 'graphql';
export declare function loadSchema(path: string): {
    errors: Error[];
    path?: string;
    schema?: GraphQLSchema;
    type?: string;
};
