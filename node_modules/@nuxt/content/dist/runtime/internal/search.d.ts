import type { CollectionQueryBuilder, PageCollectionItemBase } from '~/src/types';
type Section = {
    id: string;
    title: string;
    titles: string[];
    level: number;
    content: string;
};
export declare function generateSearchSections<T extends PageCollectionItemBase>(queryBuilder: CollectionQueryBuilder<T>, opts?: {
    ignoredTags?: string[];
    extraFields?: Array<keyof T>;
}): Promise<Section[]>;
export {};
