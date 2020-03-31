export const unwrap = (type: any): any => (type.ofType ? unwrap(type.ofType) : type);
export const wrapInNode = (thing: any) => ({ cursor: thing.toString(), node: thing });
