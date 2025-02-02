// import { expect } from 'chai';
import { Paper } from '../../src/paper';
import { Document } from '../../src/types';
import { buildSchema } from 'graphql';
import { expect } from 'chai';
import { getDocumentKey } from '../../src/document/get-document-key';
import { RemoveEvent } from '../../src/events/remove';
import { ModifyEvent } from '../../src/events/modify-document';
import { createDocument } from '../../src/document/create-document';
import { nonNullFieldValidator } from '../../src/validations/validators';

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
    account: Account!
  }

  type Team {
    id: ID!
    name: String!
    admin: Account!
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
        email: 'windows95@aol.com',
        user: {
          firstName: 'Windows',
          lastName: '95',
          dateOfBirth: '1995',
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
      expect(account.email).to.equal('windows95@aol.com');
    });

    it('looks up a document on the store via findDocument', () => {
      const foundAccount = paper.find(account) as Document;
      expect(foundAccount.id).to.equal('1');
      expect(foundAccount.email).to.equal('windows95@aol.com');
    });

    it('provides the document store structure available', () => {
      expect(paper.data.Account).to.have.length(1);
      expect(paper.data.Account?.[0]?.id).to.equal('1');
      expect(paper.data.Account?.[0]?.email).to.equal('windows95@aol.com');
    });

    it('can be spread documents into new objects', () => {
      const account = paper.data.Account[0];
      expect({ ...account }).to.deep.equal({ email: 'windows95@aol.com', id: '1' });
      expect({ ...account.user }).to.deep.equal({
        firstName: 'Windows',
        lastName: '95',
        dateOfBirth: '1995',
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
        email: 'windows95@aol.com',
      });
    });

    it('returns an array of document', () => {
      const [first, second] = paper.mutate(({ find }) => {
        return [find(account), find(account)];
      });

      expect(first).to.deep.equal({
        id: '1',
        email: 'windows95@aol.com',
      });

      expect(second).to.deep.equal({
        id: '1',
        email: 'windows95@aol.com',
      });
    });

    it('returns an object of documents', () => {
      const { first, second } = paper.mutate(({ find }) => {
        return { first: find(account), second: find(account) };
      });

      expect(first).to.deep.equal({
        id: '1',
        email: 'windows95@aol.com',
      });

      expect(second).to.deep.equal({
        id: '1',
        email: 'windows95@aol.com',
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
        expect(app.owner?.admin?.email).to.equal('windows95@aol.com');
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
      expect(app?.owner?.email).to.equal('windows95@aol.com');
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
      expect(app?.owner?.email).to.equal('windows95@aol.com');
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
      expect(team?.nullList).to.deep.equal([null, null, { id: '1', email: 'windows95@aol.com' }]);
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
      expect(originalAccount.email).to.equal('windows95@aol.com');
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
      expect((events[0] as RemoveEvent).document?.email).to.deep.equal('windows95@aol.com');
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

  describe('edge cases', () => {
    it('throws an error when trying to push to a store directly', () => {
      expect(() => paper.data.Account.push(createDocument('Account', {}))).to.throw();
    });
  });
});
