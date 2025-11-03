import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/blog-posts';
import type { BlogPostProps, BlogPostSlots } from '../types';
import type { ComponentConfig } from '../types/tv';
type BlogPosts = ComponentConfig<typeof theme, AppConfig, 'blogPosts'>;
export interface BlogPostsProps<T extends BlogPostProps = BlogPostProps> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    posts?: T[];
    /**
     * The orientation of the blog posts.
     * @defaultValue 'horizontal'
     */
    orientation?: BlogPosts['variants']['orientation'];
    class?: any;
}
type ExtendSlotWithPost<T extends BlogPostProps, K extends keyof BlogPostSlots> = BlogPostSlots[K] extends (props: infer P) => any ? (props: P & {
    post: T;
}) => any : BlogPostSlots[K];
export type BlogPostsSlots<T extends BlogPostProps = BlogPostProps> = {
    [K in keyof BlogPostSlots]: ExtendSlotWithPost<T, K>;
} & {
    default(props?: {}): any;
};
declare const __VLS_export: <T extends BlogPostProps>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<BlogPostsProps<BlogPostProps>> & import("vue").PublicProps;
    expose: (exposed: {}) => void;
    attrs: any;
    slots: BlogPostsSlots<T>;
    emit: {};
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
