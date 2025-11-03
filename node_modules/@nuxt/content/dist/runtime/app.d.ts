import type { Collections, PageCollections, CollectionQueryBuilder, SurroundOptions, SQLOperator, QueryGroupFunction, ContentNavigationItem } from '@nuxt/content';
interface ChainablePromise<T extends keyof PageCollections, R> extends Promise<R> {
    where(field: keyof PageCollections[T] | string, operator: SQLOperator, value?: unknown): ChainablePromise<T, R>;
    andWhere(groupFactory: QueryGroupFunction<PageCollections[T]>): ChainablePromise<T, R>;
    orWhere(groupFactory: QueryGroupFunction<PageCollections[T]>): ChainablePromise<T, R>;
    order(field: keyof PageCollections[T], direction: 'ASC' | 'DESC'): ChainablePromise<T, R>;
}
export declare const queryCollection: <T extends keyof Collections>(collection: T) => CollectionQueryBuilder<Collections[T]>;
export declare function queryCollectionNavigation<T extends keyof PageCollections>(collection: T, fields?: Array<keyof PageCollections[T]>): ChainablePromise<T, ContentNavigationItem[]>;
export declare function queryCollectionItemSurroundings<T extends keyof PageCollections>(collection: T, path: string, opts?: SurroundOptions<keyof PageCollections[T]>): ChainablePromise<T, ContentNavigationItem[]>;
export declare function queryCollectionSearchSections(collection: keyof Collections, opts?: {
    ignoredTags: string[];
}): ChainablePromise<string | number | symbol, {
    id: string;
    title: string;
    titles: string[];
    level: number;
    content: string;
}[]>;
export {};
