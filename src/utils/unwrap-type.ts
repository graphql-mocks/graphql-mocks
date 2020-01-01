const unwrapType = (type: any): any => type.ofType ? unwrapType(type.ofType) : type
export default unwrapType;
