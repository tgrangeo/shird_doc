import * as server from './server.js';
/**
 * `@nuxt/content/nitro` import is deprecated and will be removed in the next major version.
 * Use `@nuxt/content/server` instead.
 */
/**
 * @deprecated Import from `@nuxt/content/server` instead
 */
export declare const queryCollection: <T extends string | number | symbol>(event: import("h3").H3Event, collection: T) => CollectionQueryBuilder<Collections>;
/**
 * @deprecated Import from `@nuxt/content/server` instead
 */
export declare const queryCollectionNavigation: typeof server.queryCollectionNavigation;
/**
 * @deprecated Import from `@nuxt/content/server` instead
 */
export declare const queryCollectionItemSurroundings: typeof server.queryCollectionItemSurroundings;
/**
 * @deprecated Import from `@nuxt/content/server` instead
 */
export declare const queryCollectionSearchSections: typeof server.queryCollectionSearchSections;
