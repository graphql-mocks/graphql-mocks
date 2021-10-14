import { GraphQLSchema } from 'graphql';
export declare function saveSchema(options: {
    schema: GraphQLSchema;
    out: string;
    format: 'SDL' | 'SDL_STRING';
    force: boolean;
}): {
    savedPath: string;
};
