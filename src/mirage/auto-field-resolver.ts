const Inflector = require('inflected');

export default (mirageServer: any, mirageType: string, mirageField: string) => (parent: any) => {
  mirageType = Inflector.pluralize(mirageType).toLowerCase();

  const resolvedModel = mirageServer.schema[mirageType].find(parent.id);

  if (!resolvedModel) {
    throw new Error(`Could not resolve for mirage type: ${mirageType} with id: ${parent.id}`);
  }

  if (!resolvedModel[mirageField]) {
    throw new Error(`${mirageField} does not exist on mirage type: ${mirageType} with id: ${parent.id}`);
  }

  const resolvedField = resolvedModel[mirageField];
  return mirageServer.serializerOrRegistry.serialize(resolvedField);
}
