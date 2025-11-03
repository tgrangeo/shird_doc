import * as zod from 'zod';
import { Collection } from '@nuxt/content';

declare const ogImageSchema: zod.ZodOptional<zod.ZodObject<{
    url: zod.ZodOptional<zod.ZodString>;
    component: zod.ZodOptional<zod.ZodString>;
    props: zod.ZodRecord<zod.ZodString, zod.ZodAny>;
}, "strip", zod.ZodTypeAny, {
    props: Record<string, any>;
    url?: string | undefined;
    component?: string | undefined;
}, {
    props: Record<string, any>;
    url?: string | undefined;
    component?: string | undefined;
}>>;
declare const schema: zod.ZodObject<{
    ogImage: zod.ZodOptional<zod.ZodObject<{
        url: zod.ZodOptional<zod.ZodString>;
        component: zod.ZodOptional<zod.ZodString>;
        props: zod.ZodRecord<zod.ZodString, zod.ZodAny>;
    }, "strip", zod.ZodTypeAny, {
        props: Record<string, any>;
        url?: string | undefined;
        component?: string | undefined;
    }, {
        props: Record<string, any>;
        url?: string | undefined;
        component?: string | undefined;
    }>>;
}, "strip", zod.ZodTypeAny, {
    ogImage?: {
        props: Record<string, any>;
        url?: string | undefined;
        component?: string | undefined;
    } | undefined;
}, {
    ogImage?: {
        props: Record<string, any>;
        url?: string | undefined;
        component?: string | undefined;
    } | undefined;
}>;
declare function asOgImageCollection<T>(collection: Collection<T>): Collection<T>;

export { asOgImageCollection, ogImageSchema, schema };
