export function collapseHeaders(headers: string[]): Record<string, string> {
  const collapsed = (headers ?? []).reduce((headers, flag) => {
    const [key, value] = flag.split('=');

    if (!key || !value) {
      throw new Error(`Expected a key and value header pair, got key: ${key}, value: ${value}`);
    }

    return {
      ...headers,
      [key]: value,
    };
  }, {});

  return collapsed;
}
