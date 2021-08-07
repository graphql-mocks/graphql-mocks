import ShortUniqueId from 'short-unique-id';

const uid = new ShortUniqueId({ length: 8 });
export const generateDocumentKey = (): string => uid();
