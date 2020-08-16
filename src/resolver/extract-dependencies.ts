import { PackOptions } from '../pack/types';
import { ResolverContext } from '../types';

type PackDependencies = PackOptions['dependencies'];

export function extractAllDependencies<T extends PackDependencies>(context: ResolverContext): T {
  const packedDependencies = context?.pack?.dependencies ?? {};
  return packedDependencies as T;
}

export function extractDependencies<T extends PackDependencies>(
  context: ResolverContext,
  requestedDependencies: (keyof T)[],
  options?: { required: true },
): T extends PackDependencies ? Required<T> : Required<PackDependencies>;
export function extractDependencies<T extends PackDependencies>(
  context: ResolverContext,
  requestedDependencies: (keyof T)[],
  options?: { required: false },
): T extends PackDependencies ? Partial<T> : Partial<PackDependencies>;
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function extractDependencies<T extends PackDependencies>(
  context: ResolverContext,
  requestedDependencies: (keyof T)[],
  options = { required: true },
) {
  const packedDependencies = extractAllDependencies<T>(context);

  if (!Array.isArray(requestedDependencies) || requestedDependencies.length === 0) {
    return packedDependencies;
  }

  options = typeof options !== 'object' ? { required: true } : options;
  options.required = 'required' in options ? options.required : true;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extracted: any = {};
  const missingRequiredDependencies: string[] = [];

  requestedDependencies.forEach((dependencyName) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dependency = (packedDependencies as any)[dependencyName];

    if (options?.required && dependency == null) {
      missingRequiredDependencies.push(dependencyName.toString());
    }

    extracted[dependencyName] = dependency;
  });

  if (missingRequiredDependencies.length > 0) {
    const missingKeys = missingRequiredDependencies.map((key) => `"${key}"`).join(', ');
    throw new Error(
      `Expected to find dependencies with keys: ${missingKeys}\n` +
        'Either:\n' +
        ' * Add these to `dependencies` to your `GraphQLHandler` class or `pack` function\n' +
        ' * Use { required : false } as the third argument to `extractDependencies` and allow for these to be optional dependencies',
    );
  }

  return extracted;
}
