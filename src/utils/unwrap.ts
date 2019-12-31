const unwrapType = (type: any) => type.ofType ? unwrapType(type.ofType) : type
export default unwrapType;
