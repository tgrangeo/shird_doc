import type { CollapsibleRootProps, CollapsibleRootEmits } from 'reka-ui';
import type { TocLink } from '@nuxt/content';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/content/content-toc';
import type { IconProps } from '../../types';
import type { ComponentConfig } from '../../types/tv';
type ContentToc = ComponentConfig<typeof theme, AppConfig, 'contentToc'>;
export type ContentTocLink = TocLink & {
    class?: any;
    ui?: Pick<ContentToc['slots'], 'item' | 'itemWithChildren' | 'link' | 'linkText'>;
};
export interface ContentTocProps<T extends ContentTocLink = ContentTocLink> extends Pick<CollapsibleRootProps, 'defaultOpen' | 'open'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'nav'
     */
    as?: any;
    /**
     * The icon displayed to collapse the content.
     * @defaultValue appConfig.ui.icons.chevronDown
     * @IconifyIcon
     */
    trailingIcon?: IconProps['name'];
    /**
     * The title of the table of contents.
     * @defaultValue t('contentToc.title')
     */
    title?: string;
    /**
     * @defaultValue 'primary'
     */
    color?: ContentToc['variants']['color'];
    /**
     * Display a line next to the active link.
     * @defaultValue false
     */
    highlight?: boolean;
    /**
     * @defaultValue 'primary'
     */
    highlightColor?: ContentToc['variants']['highlightColor'];
    links?: T[];
    class?: any;
    ui?: ContentToc['slots'];
}
export type ContentTocEmits = CollapsibleRootEmits & {
    move: [id: string];
};
type SlotProps<T> = (props: {
    link: T;
}) => any;
export interface ContentTocSlots<T extends ContentTocLink = ContentTocLink> {
    leading(props: {
        open: boolean;
        ui: ContentToc['ui'];
    }): any;
    default(props: {
        open: boolean;
    }): any;
    trailing(props: {
        open: boolean;
        ui: ContentToc['ui'];
    }): any;
    content(props: {
        links: T[];
    }): any;
    link: SlotProps<T>;
    top(props: {
        links?: T[];
    }): any;
    bottom(props: {
        links?: T[];
    }): any;
}
declare const __VLS_export: <T extends ContentTocLink>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<ContentTocProps<T> & {
        "onUpdate:open"?: ((value: boolean) => any) | undefined;
        onMove?: ((id: string) => any) | undefined;
    }> & import("vue").PublicProps;
    expose: (exposed: {}) => void;
    attrs: any;
    slots: ContentTocSlots<T>;
    emit: ((evt: "update:open", value: boolean) => void) & ((evt: "move", id: string) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
