import { expect } from 'chai';
import { extractDependencies, extractAllDependencies } from '../../../src/resolver/extract-dependencies';
import { generatePackOptions } from '../../mocks';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateMocksContextWithDependencies = (dependencies: any): any => {
  return {
    pack: generatePackOptions({
      dependencies,
    }),
  };
};

const missingRequiredDependencyError = `Expected to find dependencies with keys: "does not exist"
Either:
 * Add these to \`dependencies\` to your \`GraphQLHandler\` class or \`pack\` function
 * Use { required : false } as the third argument to \`extractDependencies\` and allow for these to be optional dependencies`;

describe('resolvers/extract-dependencies', function () {
  const mockContext = generateMocksContextWithDependencies({
    test: 'hello world',
    otherDependency: 'guten tag',
  });

  describe('#extractAllDependencies', function () {
    it('pulls the dependencies hash from context and returns it', function () {
      expect(extractAllDependencies(mockContext)).to.deep.equal({
        test: 'hello world',
        otherDependency: 'guten tag',
      });
    });

    it('returns an empty object if it cannot find the dependencies on context', function () {
      expect(extractAllDependencies({})).to.deep.equal({});
    });
  });

  describe('#extractDependencies', function () {
    it('extracts a dependency when a dependency list is specified', function () {
      expect(extractDependencies(mockContext, ['test'])).to.deep.equal({
        test: 'hello world',
      });
    });

    describe('when dependencies do not exist', function () {
      describe('and the required option is set to true', function () {
        it('by default, throws if a dependency does not exist', function () {
          expect(() => extractDependencies(mockContext, ['does not exist'])).to.throw(missingRequiredDependencyError);
        });

        it('throws if a dependency does not exist and required option is set', function () {
          expect(() => extractDependencies(mockContext, ['does not exist'], { required: true })).to.throw(
            missingRequiredDependencyError,
          );
        });
      });

      describe('and the required option is set to false', function () {
        it('returns an object where the result is undefined', function () {
          const dependencies = extractDependencies(mockContext, ['does not exist'], { required: false });
          expect(dependencies).to.have.property('does not exist');
          expect(dependencies['does not exist']).to.equal(undefined);
        });
      });
    });

    describe('type tests', function () {
      type Person = {
        name?: string | undefined;
      };

      type Dependencies = {
        person: Person;
      };

      const dependencies: Dependencies = {
        person: { name: 'Homer' },
      };

      const mockContext = generateMocksContextWithDependencies(dependencies);

      describe('with type definitions', function () {
        it('type is passed through and no nullish check is required', function () {
          const result = extractDependencies<Dependencies>(mockContext, ['person'], { required: true });
          expect(result.person.name).to.equal(
            'Homer',
            'was able to access property chain directly without checking for nullish',
          );
        });

        it('type is passed through and nullish check is required', function () {
          const result = extractDependencies<Dependencies>(mockContext, ['person'], { required: false });
          // optional chaining is required on person property to avoid compile error
          expect(result.person?.name).to.equal(
            'Homer',
            'was able to access property chain directly without checking for nullish',
          );
        });

        it('allows a type parameter to be known one level deep based on dependency key name', function () {
          // will have to do a type check after this but it's known to be non-nullish
          const result = extractDependencies(mockContext, ['person'], { required: true });
          expect((result.person as Record<string, unknown>).name).to.equal(
            'Homer',
            'was able to access the person property without checking if it existed',
          );
        });
      });
    });
  });
});
