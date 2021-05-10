import { produce, setAutoFreeze } from 'immer';
import { proxyWrap } from './utils/proxy-wrap';
import { transaction } from './transaction';
import { DataStore, TransactionCallback, ContextualOperationMap, DefaultContextualOperations } from './types';
import { graphqlCheck } from './validations/graphql-check';
import { GraphQLSchema } from 'graphql';

// Auto Freezing needs to be disabled because it interfers with using
// of using js a `Proxy` on the resulting data, see:
// > 18.5.5.7 Example: non-writable non-configurable target properties
// > must be represented faithfully
// > https://exploringjs.com/deep-js/ch_proxies.html
setAutoFreeze(false);

export class Store {
  history: DataStore[] = [];
  current: DataStore = {};
  private sourceGrapQLSchema: GraphQLSchema;

  constructor(graphqlSchema: GraphQLSchema) {
    this.sourceGrapQLSchema = graphqlSchema;
  }

  get data(): DataStore {
    return proxyWrap(this, this.current);
  }

  async mutate<T extends ContextualOperationMap = DefaultContextualOperations>(
    fn: TransactionCallback<T>,
  ): Promise<Store> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const next: DataStore = produce(transaction)(this.current, fn as any);

    graphqlCheck(next, this.sourceGrapQLSchema);

    this.history.push(next);
    this.current = next;

    return this;
  }
}
