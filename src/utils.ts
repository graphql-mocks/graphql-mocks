export const unwrap = (type: any): any => (type?.ofType ? unwrap(type.ofType) : type);
export const extractDependencies = (context: any) => context?.pack?.dependencies;
