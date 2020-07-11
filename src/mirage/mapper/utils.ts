export function assertValidTupleDef(def: unknown): void {
  if (!Array.isArray(def)) {
    throw new TypeError(
      `Definition given must be a valid FieldReference (ie: ['typeName', 'fieldName']) or a valid MirageAttrReference(ie: ['modelName', 'attrName'])`,
    );
  }

  const hasStringValues = def.every((value: unknown) => typeof value === 'string');
  if (!hasStringValues) {
    throw new TypeError(`Each value in array definition must be a string`);
  }

  if (def.length !== 2) {
    throw new TypeError(`Definition must contain two strings, got a length of ${def.length}`);
  }
}
