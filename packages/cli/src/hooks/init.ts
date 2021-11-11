module.exports = async function () {
  // load ts-node to support dynamically loading and parsing
  // typescript files
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('ts-node').register({});
};
