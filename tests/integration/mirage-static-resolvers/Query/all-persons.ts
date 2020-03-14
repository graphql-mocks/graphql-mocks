export default function(_parent: any, _args: any, { mirage }: any /*, info*/) {
  return mirage.schema.people.all().models;
}
