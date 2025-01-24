import { Paper } from '../../src/paper';
import { Document } from '../../src/types';
import { buildSchema } from 'graphql';
import { expect } from 'chai';
import { getDocumentKey } from '../../src/document/get-document-key';
import { RemoveEvent } from '../../src/events/remove';
import { ModifyEvent } from '../../src/events/modify-document';
import { createDocument } from '../../src/document/create-document';
import { nonNullFieldValidator } from '../../src/validations/validators';
import { getConnections, nullDocument } from '../../src/document';

const schemaString = `
  schema {
    query: Query
  }

  type Query {
    apps: App
  }

  type Account {
    id: ID!
    email: String!
    user: User!
  }

  type User {
    firstName: String!
    lastName: String!
    dateOfBirth: String!
    account: Account
  }

  type Team {
    id: ID!
    name: String!
    admin: Account!
    accounts: [Account!]!
    nullList: [Account]
  }

  union AppOwner = Account | Team

  type App {
    id: ID!
    name: String!
    owner: AppOwner!
    secondaryOwner: AppOwner
    releasedAt: String
    archivedAt: String
  }
`;
const graphqlSchema = buildSchema(schemaString);

describe('happy path', () => {
  let paper: Paper;
  let account: Document;
  let events: any[];

  beforeEach(() => {
    paper = new Paper(graphqlSchema);

    paper.mutate(({ create }) => {
      const account = create('Account', {
        id: '1',
        email: 'homer@thesimpsons.com',
        user: {
          firstName: 'Homer',
          lastName: 'Simpson',
          dateOfBirth: '1989',
        },
      });

      account.user.account = account;
    });

    events = [];
    account = paper.data.Account.find((account) => account.id === '1') as Document;
  });

  describe('look ups', () => {
    it('provides a __typename property via the document', () => {
      expect(account.__typename).to.equal('Account');
    });

    it('looks up a document on the store via find', () => {
      const account = paper.data.Account.find((account) => account.id === '1') as Document;
      expect(account.id).to.equal('1');
      expect(account.email).to.equal('homer@thesimpsons.com');
    });

    it('looks up a document on the store via findDocument', () => {
      const foundAccount = paper.find(account) as Document;
      expect(foundAccount.id).to.equal('1');
      expect(foundAccount.email).to.equal('homer@thesimpsons.com');
    });

    it('provides the document store structure available', () => {
      expect(paper.data.Account).to.have.length(1);
      expect(paper.data.Account?.[0]?.id).to.equal('1');
      expect(paper.data.Account?.[0]?.email).to.equal('homer@thesimpsons.com');
    });

    it('can be spread documents into new objects', () => {
      const account = paper.data.Account[0];
      expect({ ...account }).to.deep.equal({ email: 'homer@thesimpsons.com', id: '1' });
      expect({ ...account.user }).to.deep.equal({
        firstName: 'Homer',
        lastName: 'Simpson',
        dateOfBirth: '1989',
      });
    });
  });

  describe('mutation transaction payloads', () => {
    it('returns a document', () => {
      const payload = paper.mutate(({ find }) => {
        return find(account);
      });

      expect(payload).to.deep.equal({
        id: '1',
        email: 'homer@thesimpsons.com',
      });
    });

    it('returns an array of document', () => {
      const [first, second] = paper.mutate(({ find }) => {
        return [find(account), find(account)];
      });

      expect(first).to.deep.equal({
        id: '1',
        email: 'homer@thesimpsons.com',
      });

      expect(second).to.deep.equal({
        id: '1',
        email: 'homer@thesimpsons.com',
      });
    });

    it('returns an object of documents', () => {
      const { first, second } = paper.mutate(({ find }) => {
        return { first: find(account), second: find(account) };
      });

      expect(first).to.deep.equal({
        id: '1',
        email: 'homer@thesimpsons.com',
      });

      expect(second).to.deep.equal({
        id: '1',
        email: 'homer@thesimpsons.com',
      });
    });
  });

  describe('mutations', () => {
    it('provides __typename on documents within #mutate', () => {
      paper.mutate(({ find }) => {
        const $account = find(account);
        expect($account?.__typename).to.equal('Account');
      });
    });

    it('creates a new document', () => {
      paper.events.addEventListener('create', (e) => events.push(e));

      paper.mutate(({ create }) => {
        create('Account', {
          id: '2',
          email: 'macos9@aol.com',
        });
      });

      const account = paper.data.Account.find((document) => document.id === '2');
      expect(account?.id).to.equal('2');
      expect(account?.email).to.equal('macos9@aol.com');

      expect(events).to.have.lengthOf(1);
      expect(events[0]?.name).to.equal('create');
      expect(events[0]?.document?.id).to.equal('2');
      expect(events[0]?.document?.email).to.equal('macos9@aol.com');
    });

    it('can hop multiple document connections within mutation transactions', () => {
      paper.mutate(({ create, find }) => {
        const $account = find(account);

        const team = create('Team', {
          id: '1',
          name: 'my-fancy-app',
          admin: $account,
        });

        create('App', {
          id: '1',
          name: 'my-fancy-app',
          owner: team,
        });
      });

      paper.mutate(({ getStore }) => {
        const apps = getStore().App;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const app = apps.find((app: Document) => app.id === '1')!;
        expect(app.owner?.admin?.email).to.equal('homer@thesimpsons.com');
      });
    });

    it('creates a new document with a connected document, implictly on property at creation', () => {
      paper.mutate(({ create }) => {
        create('App', {
          id: '1',
          name: 'my-fancy-app',
          owner: account,
        });
      });

      const app = paper.data.App.find((document) => document.id === '1');
      expect(app?.name).to.equal('my-fancy-app');
      expect(app?.owner?.email).to.equal('homer@thesimpsons.com');
    });

    it('creates a new document with a connected document, explicitly by property reference', () => {
      paper.mutate(({ create }) => {
        const app = create('App', {
          id: '1',
          name: 'my-fancy-app',
        });

        app.owner = account;
      });

      const app = paper.data.App.find((document) => document.id === '1');
      expect(app?.name).to.equal('my-fancy-app');
      expect(app?.owner?.email).to.equal('homer@thesimpsons.com');
    });

    it('connects to null documents', () => {
      paper.mutate(({ create }) => {
        const team = create('Team', {
          id: '1',
          name: 'my-fancy-app',
          admin: {
            id: '2',
            email: 'test@aol.com',
          },
        });

        team.nullList = [null, null, account];
      });

      const team = paper.data.Team.find((document) => document.id === '1');
      expect(team?.nullList).to.deep.equal([null, null, { id: '1', email: 'homer@thesimpsons.com' }]);
    });

    it('edits an existing document', () => {
      const originalAccount = account;
      paper.events.addEventListener('modify', (e) => events.push(e));

      paper.mutate(({ find }) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const acc = find(account as Document)!;
        acc.id = '5';
        acc.email = 'beos@aol.com';
      });

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const updatedAccount = paper.data.Account.find((document) => document.id === '5')!;
      expect(getDocumentKey(originalAccount)).to.equal(getDocumentKey(updatedAccount));
      expect(originalAccount.email).to.equal('homer@thesimpsons.com');
      expect(updatedAccount.email).to.equal('beos@aol.com');
      expect(events).to.have.lengthOf(1);

      const [event] = events;
      expect((event as ModifyEvent).document.id).to.equal('5');
      expect((event as ModifyEvent).document.email).to.equal('beos@aol.com');
      expect((event as ModifyEvent).changes.id.value).to.equal('5');
      expect((event as ModifyEvent).changes.id.previousValue).to.equal('1');
    });

    it('clones an existing document', () => {
      paper.mutate(({ find, clone }) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const acc = find(account)!;
        const cloned = clone(acc);
        cloned.id = 'cloned';
      });

      const accounts = paper.data.Account;
      expect(accounts).to.have.lengthOf(2);
      expect(accounts[0].email).to.equal(account.email);
      expect(accounts[1].email).to.equal(account.email);
    });

    it('removes existing documents', () => {
      paper.events.addEventListener('remove', (e) => events.push(e));

      paper.mutate(({ remove }) => {
        remove(account);
      });

      expect(events).to.have.lengthOf(1);
      expect(events[0]?.name).to.equal('remove');
      expect((events[0] as RemoveEvent).document?.id).to.deep.equal('1');
      expect((events[0] as RemoveEvent).document?.email).to.deep.equal('homer@thesimpsons.com');
    });

    it('allows direct access to the store', () => {
      paper.mutate(({ getStore }) => {
        const store = getStore();
        const accounts = store.Account;
        expect(accounts).to.have.lengthOf(1);
        expect(accounts[0].email).to.equal(account.email);
        accounts[0].email = 'updated-email@yahoo.com';
      });

      expect(paper.data.Account[0].email).to.equal('updated-email@yahoo.com');
    });
  });

  describe('validations', () => {
    it('provides validation feedback on transactions', () => {
      let caughtError;

      // add validator not included by default
      paper.validators.field.push(nonNullFieldValidator as any);

      try {
        paper.mutate(({ create }) => {
          create('Account', {
            id: '2',
            email: null,
          });
        });
      } catch (error) {
        caughtError = error as Error;
      }

      expect((caughtError as Error).message).to.equal(
        'The field "email" represents a graphql "String! (non-null)" type and on the document should be a non-null, but got null',
      );
    });
  });

  describe('hooks', () => {
    context('beforeTransaction', () => {
      it('hooks', () => {
        let counter = 0;

        paper.hooks.beforeTransaction.push(({ create }) => {
          counter++;
          create('Team', {
            id: counter.toString(),
            name: `The ${counter} team`,
            admin: account,
          });
        });

        paper.mutate(({ getStore }) => {
          expect(getStore().Team).to.have.lengthOf(1);
        });

        paper.mutate(({ getStore }) => {
          expect(getStore().Team).to.have.lengthOf(2);
        });

        expect(paper.data.Team).to.have.lengthOf(2);
        expect(paper.data.Team[0].id).to.equal('1');
        expect(paper.data.Team[0].name).to.equal('The 1 team');
        expect(paper.data.Team[1].id).to.equal('2');
        expect(paper.data.Team[1].name).to.equal('The 2 team');
      });
    });

    context('afterTransaction', () => {
      it('hooks', () => {
        let counter = 0;

        paper.hooks.afterTransaction.push(({ create }) => {
          counter++;
          create('Team', {
            id: counter.toString(),
            name: `The ${counter} team`,
            admin: account,
          });
        });

        paper.mutate(({ getStore }) => {
          expect(getStore().Team).to.have.lengthOf(0);
        });

        paper.mutate(({ getStore }) => {
          expect(getStore().Team).to.have.lengthOf(1);
        });

        expect(paper.data.Team).to.have.lengthOf(2);
        expect(paper.data.Team[0].id).to.equal('1');
        expect(paper.data.Team[0].name).to.equal('The 1 team');
        expect(paper.data.Team[1].id).to.equal('2');
        expect(paper.data.Team[1].name).to.equal('The 2 team');
      });
    });
  });

  describe('serialize', () => {
    it('serializes an empty paper instance', () => {
      paper = new Paper(graphqlSchema);
      const serialized = paper.serialize();
      expect(serialized.store).to.deep.equal({
        Account: [],
        App: [],
        Team: [],
        User: [],
      });

      expect(serialized.__meta__).to.have.keys(['NULL_DOCUMENT_KEY']);
      expect(serialized.__meta__.NULL_DOCUMENT_KEY).to.be.a.string;
    });

    it('serializes a paper instance with data', () => {
      const serialized = paper.serialize();

      expect(serialized.store.App).to.deep.equal([]);
      expect(serialized.store.Team).to.deep.equal([]);
      expect(serialized.store.Account).to.have.lengthOf(1);
      expect(serialized.store.User).to.have.lengthOf(1);

      const serializedAccount = serialized.store.Account[0];
      expect(serializedAccount).to.have.property('id', '1');
      expect(serializedAccount).to.have.property('email', 'homer@thesimpsons.com');
      expect(serializedAccount.__meta__.DOCUMENT_CONNECTIONS.user).to.be.a.string;
      expect(serializedAccount.__meta__).to.have.property('DOCUMENT_GRAPHQL_TYPENAME');
      expect(serializedAccount.__meta__).to.have.property('DOCUMENT_KEY');

      const serializedUser = serialized.store.User[0];
      expect(serializedUser).to.have.property('dateOfBirth', '1989');
      expect(serializedUser).to.have.property('firstName', 'Homer');
      expect(serializedUser).to.have.property('lastName', 'Simpson');
      expect(serializedUser.__meta__.DOCUMENT_CONNECTIONS.account).to.be.a.string;
      expect(serializedUser.__meta__).to.have.property('DOCUMENT_GRAPHQL_TYPENAME');
      expect(serializedUser.__meta__).to.have.property('DOCUMENT_KEY');
    });

    it('serializes singularly connected documents', () => {
      const serialized = paper.serialize();

      const userKey = serialized.store.User[0].__meta__.DOCUMENT_KEY;
      const userWithAccountKey = serialized.store.User[0].__meta__.DOCUMENT_CONNECTIONS.account;
      const accountKey = serialized.store.Account[0].__meta__.DOCUMENT_KEY;
      const accountWithUserKey = serialized.store.Account[0].__meta__.DOCUMENT_CONNECTIONS.user;

      expect(userKey).to.be.a.string;
      expect(accountKey).to.be.a.string;

      expect([userKey]).to.deep.equal(accountWithUserKey);
      expect([accountKey]).to.deep.equal(userWithAccountKey);
    });

    it('serializes a list of documents', () => {
      paper.mutate(({ create }) => {
        create('Team', {
          id: 'team-1',
          name: 'Best Team',
          admin: paper.data.Account[0],
          accounts: [
            paper.data.Account[0],
            {
              id: '2',
              email: 'bart@thesimpsons.com',
              user: {
                firstName: 'Bart',
                lastName: 'Simpson',
                dateOfBirth: '1998',
              },
            },
          ],
        });
      });

      const serialized = paper.serialize();
      expect(serialized.store.Team).to.have.lengthOf(1);
      const serializedTeam = serialized.store.Team[0];
      expect(serializedTeam).to.have.property('id', 'team-1');
      expect(serializedTeam).to.have.property('name', 'Best Team');
      expect(serializedTeam).to.have.property('__meta__');
      expect(serializedTeam.__meta__).to.have.property('DOCUMENT_GRAPHQL_TYPENAME', 'Team');
      expect(serializedTeam.__meta__.DOCUMENT_KEY).to.be.a.string;

      // `admin` is a singular connection
      expect(serializedTeam.__meta__.DOCUMENT_CONNECTIONS).to.have.property('admin');
      expect(serializedTeam.__meta__.DOCUMENT_CONNECTIONS.admin).deep.equal([
        serialized.store.Account[0].__meta__.DOCUMENT_KEY,
      ]);

      // `accounts` is a list connection to multiple accounts
      expect(serializedTeam.__meta__.DOCUMENT_CONNECTIONS).to.have.property('accounts');
      expect(serializedTeam.__meta__.DOCUMENT_CONNECTIONS.accounts).deep.equal([
        serialized.store.Account[0].__meta__.DOCUMENT_KEY,
        serialized.store.Account[1].__meta__.DOCUMENT_KEY,
      ]);
    });

    it('serializes a list containing null', () => {
      paper.mutate(({ create }) => {
        create('Team', {
          id: 'team-1',
          name: 'Best Team',
          admin: paper.data.Account[0],
          accounts: [paper.data.Account[0]],
          nullList: [null, null],
        });
      });

      const serialized = paper.serialize();
      expect(serialized.store.Team[0].__meta__.DOCUMENT_CONNECTIONS).to.have.property('nullList');
      expect(serialized.store.Team[0].__meta__.DOCUMENT_CONNECTIONS.nullList).to.deep.equal([
        getDocumentKey(nullDocument),
        getDocumentKey(nullDocument),
      ]);
    });

    it('omits a relationship in serialization when null', () => {
      paper.mutate(({ create }) => {
        create('User', {
          firstName: 'Bart',
          lastName: 'Simpson',
          dateOfBirth: '2000',
          account: null,
        });
      });

      const serialized = paper.serialize();
      expect(serialized.store.User[1]).property('firstName', 'Bart');
      expect(serialized.store.User[1]).property('lastName', 'Simpson');
      expect(serialized.store.User[1].__meta__.DOCUMENT_CONNECTIONS).to.deep.equal({});
    });

    it('omits a relationship in serialization when null', () => {
      paper.mutate(({ create }) => {
        create('User', {
          firstName: 'Bart',
          lastName: 'Simpson',
          dateOfBirth: '2000',
          // account: null,   << account is ommitted from definition
        });
      });

      const serialized = paper.serialize();
      expect(serialized.store.User[1]).property('firstName', 'Bart');
      expect(serialized.store.User[1]).property('lastName', 'Simpson');
      expect(serialized.store.User[1].__meta__.DOCUMENT_CONNECTIONS).to.deep.equal({});
    });
  });

  describe('deserialize', () => {
    it('deserializes an empty store', () => {
      paper = new Paper(graphqlSchema);
      const serialized = paper.serialize();
      const newPaperInstance = new Paper(graphqlSchema, { serialiedPayload: serialized });
      expect(newPaperInstance.data).to.deep.equal({ Account: [], App: [], Team: [], User: [] });
    });

    it('deserializes a paper instance with data', () => {
      const serialized = paper.serialize();
      const newPaperInstance = new Paper(graphqlSchema, { serialiedPayload: serialized });
      expect(paper.data).to.deep.equal(newPaperInstance.data);
      expect(paper.data.Account[0]).to.deep.equal(newPaperInstance.data.Account[0]);
      expect(newPaperInstance.data.Account[0].email).to.equal('homer@thesimpsons.com');
    });

    it('maintains document keys', () => {
      const serialized = paper.serialize();
      const newPaperInstance = new Paper(graphqlSchema, { serialiedPayload: serialized });
      expect(getDocumentKey(paper.data.Account[0])).to.equal(getDocumentKey(newPaperInstance.data.Account[0]));
    });

    it('maintains typenames', () => {
      const serialized = paper.serialize();
      const newPaperInstance = new Paper(graphqlSchema, { serialiedPayload: serialized });
      expect(paper.data.Account[0].__typename).to.equal(newPaperInstance.data.Account[0].__typename);
    });

    it('maintains connections', () => {
      const serialized = paper.serialize();
      const newPaperInstance = new Paper(graphqlSchema, { serialiedPayload: serialized });
      expect(getConnections(paper.data.Account[0])).to.deep.equal(getConnections(newPaperInstance.data.Account[0]));
    });

    it('deserializes singularly connected documents', () => {
      const serialized = paper.serialize();
      const newPaperInstance = new Paper(graphqlSchema, { serialiedPayload: serialized });
      expect(getConnections(paper.data.Account[0]).user).to.have.lengthOf(1);
      expect(getConnections(paper.data.Account[0])).to.deep.equal(getConnections(newPaperInstance.data.Account[0]));
    });

    it('deserializes a list of documents', () => {
      paper.mutate(({ create }) => {
        create('Team', {
          id: 'team-1',
          name: 'Best Team',
          admin: paper.data.Account[0],
          accounts: [
            paper.data.Account[0],
            {
              id: '2',
              email: 'bart@thesimpsons.com',
              user: {
                firstName: 'Bart',
                lastName: 'Simpson',
                dateOfBirth: '1998',
              },
            },
          ],
        });
      });

      const serialized = paper.serialize();
      const newPaperInstance = new Paper(graphqlSchema, { serialiedPayload: serialized });
      expect(getConnections(paper.data.Team[0]).accounts).to.have.lengthOf(2);
      expect(getConnections(paper.data.Team[0])).to.deep.equal(getConnections(newPaperInstance.data.Team[0]));
    });
  });

  describe('edge cases', () => {
    it('throws an error when trying to push to a store directly', () => {
      expect(() => paper.data.Account.push(createDocument('Account', {}))).to.throw();
    });
  });
});
