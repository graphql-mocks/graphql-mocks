import { expect, test } from '@oclif/test';
import { validateConfig } from '../../src/lib/validate-config';

function errorsToMessages(errors: Error[]) {
  return errors.map((e) => e.message);
}

function errorsInclude(errors: Error[], string: string) {
  const messages = errorsToMessages(errors);
  return messages.some((msg) => msg.includes(string));
}

describe('lib/validate-config', () => {
  test.it('checks if config is an object', () => {
    const errors = validateConfig('string', '/foobar-path/');
    expect(errorsInclude(errors, 'config must be an object')).to.be.true;
  });

  describe('#schema', () => {
    test.it('checks if schema key exists', () => {
      const errors = validateConfig({}, '/foobar-path/');
      expect(errorsInclude(errors, 'config.schema is a required entry')).to.be.true;
    });

    test.it('#schema.url must be a string', () => {
      const errors = validateConfig(
        {
          schema: {
            url: {},
          },
        },
        '/foobar-path/',
      );
      expect(errorsInclude(errors, 'config.schema.url must be a string')).to.be.true;
    });

    test.it('#schema.url must be a valid url', () => {
      const errors = validateConfig(
        {
          schema: {
            url: 'asdf',
          },
        },
        '/foobar-path/',
      );
      expect(errorsInclude(errors, 'Could not parse config.schema.url')).to.be.true;
    });
  });

  describe('#handler', () => {
    test.it('checks handler key exists', () => {
      const errors = validateConfig({}, '/foobar-path/');
      expect(errorsInclude(errors, 'config.handler is a required entry')).to.be.true;
    });

    test.it('checks path is set', () => {
      const errors = validateConfig(
        {
          handler: {},
        },
        '/foobar-path/',
      );

      expect(errorsInclude(errors, 'config.handler.path is a required key')).to.be.true;
    });

    test.it('checks path is valid', () => {
      const errors = validateConfig(
        {
          handler: {
            path: 'asdf',
          },
        },
        '/foobar-path/',
      );
      expect(errorsInclude(errors, 'Could not locate config.handler at asdf')).to.be.true;
    });
  });

  describe('#resolverMap', () => {
    test.it('checks path is valid', () => {
      const errors = validateConfig(
        {
          resolverMap: {
            path: 'asdf',
          },
        },
        '/foobar-path/',
      );

      expect(errorsInclude(errors, 'Could not locate config.resolverMap at asdf')).to.be.true;
    });
  });

  describe('#resolvers', () => {
    test.it('checks path is valid', () => {
      const errors = validateConfig(
        {
          resolvers: {
            path: 'asdf',
          },
        },
        '/foobar-path/',
      );

      expect(errorsInclude(errors, 'Unable to find directory for config.resolvers.path at ')).to.be.true;
    });

    test.it('checks organizedBy is set', () => {
      const errors = validateConfig(
        {
          resolvers: {},
        },
        '/foobar-path/',
      );

      expect(errorsInclude(errors, 'config.resolvers.organizedBy is required and currently must be set to "TYPE"')).to
        .be.true;
    });
  });
});
