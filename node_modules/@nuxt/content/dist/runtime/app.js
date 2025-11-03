import { collectionQueryBuilder } from "./internal/query.js";
import { generateNavigationTree } from "./internal/navigation.js";
import { generateItemSurround } from "./internal/surround.js";
import { generateSearchSections } from "./internal/search.js";
import { fetchQuery } from "./internal/api.js";
import { tryUseNuxtApp } from "#imports";
export const queryCollection = (collection) => {
  const event = tryUseNuxtApp()?.ssrContext?.event;
  return collectionQueryBuilder(collection, (collection2, sql) => executeContentQuery(event, collection2, sql));
};
export function queryCollectionNavigation(collection, fields) {
  return chainablePromise(collection, (qb) => generateNavigationTree(qb, fields));
}
export function queryCollectionItemSurroundings(collection, path, opts) {
  return chainablePromise(collection, (qb) => generateItemSurround(qb, path, opts));
}
export function queryCollectionSearchSections(collection, opts) {
  return chainablePromise(collection, (qb) => generateSearchSections(qb, opts));
}
async function executeContentQuery(event, collection, sql) {
  if (import.meta.client && window.WebAssembly) {
    return queryContentSqlClientWasm(collection, sql);
  } else {
    return fetchQuery(event, String(collection), sql);
  }
}
async function queryContentSqlClientWasm(collection, sql) {
  const rows = await import("./internal/database.client.js").then((m) => m.loadDatabaseAdapter(collection)).then((db) => db.all(sql));
  return rows;
}
function chainablePromise(collection, fn) {
  const queryBuilder = queryCollection(collection);
  const chainable = {
    where(field, operator, value) {
      queryBuilder.where(String(field), operator, value);
      return chainable;
    },
    andWhere(groupFactory) {
      queryBuilder.andWhere(groupFactory);
      return chainable;
    },
    orWhere(groupFactory) {
      queryBuilder.orWhere(groupFactory);
      return chainable;
    },
    order(field, direction) {
      queryBuilder.order(String(field), direction);
      return chainable;
    },
    then(onfulfilled, onrejected) {
      return fn(queryBuilder).then(onfulfilled, onrejected);
    },
    catch(onrejected) {
      return this.then(void 0, onrejected);
    },
    finally(onfinally) {
      return this.then(void 0, void 0).finally(onfinally);
    },
    get [Symbol.toStringTag]() {
      return "Promise";
    }
  };
  return chainable;
}
