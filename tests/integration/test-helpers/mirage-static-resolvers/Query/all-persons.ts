export default function(_parent: any, _args: any, { pack }: any /*, info*/) {
  const { mirageServer } = pack.dependencies;
  return mirageServer.schema.people.all().models;
}
