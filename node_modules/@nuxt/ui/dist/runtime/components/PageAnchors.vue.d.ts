import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/page-anchors';
import type { IconProps, LinkProps } from '../types';
import type { ComponentConfig } from '../types/tv';
type PageAnchors = ComponentConfig<typeof theme, AppConfig, 'pageAnchors'>;
export interface PageAnchor extends Omit<LinkProps, 'custom'> {
    label: string;
    /**
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    class?: any;
    ui?: Pick<PageAnchors['slots'], 'item' | 'link' | 'linkLabel' | 'linkLabelExternalIcon' | 'linkLeading' | 'linkLeadingIcon'>;
}
export interface PageAnchorsProps<T extends PageAnchor = PageAnchor> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'nav'
     */
    as?: any;
    links?: T[];
    class?: any;
    ui?: PageAnchors['slots'];
}
type SlotProps<T> = (props: {
    link: T;
    active: boolean;
    ui: PageAnchors['ui'];
}) => any;
export interface PageAnchorsSlots<T extends PageAnchor = PageAnchor> {
    'link': SlotProps<T>;
    'link-leading': SlotProps<T>;
    'link-label'(props: {
        link: T;
        active: boolean;
    }): any;
    'link-trailing'(props: {
        link: T;
        active: boolean;
    }): any;
}
declare const __VLS_export: <T extends PageAnchor>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<PageAnchorsProps<T>> & import("vue").PublicProps;
    expose: (exposed: {}) => void;
    attrs: any;
    slots: PageAnchorsSlots<T>;
    emit: {};
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
