export async function makeRequest(
  address: string,
  query: string,
  variables?: Record<string, unknown>,
  operationName?: string,
): Promise<unknown> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = { query };

  if (variables) {
    body.variables = variables;
  }

  if (operationName) {
    body.operationName = operationName;
  }

  const result = await fetch(address, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return result.json();
}
