import type { ButtonProps } from '../types';
export interface DashboardSidebarToggleProps extends /** @vue-ignore */ Pick<ButtonProps, 'as' | 'size' | 'disabled' | 'ui'> {
    side?: 'left' | 'right';
    /**
     * @defaultValue 'neutral'
     */
    color?: ButtonProps['color'];
    /**
     * @defaultValue 'ghost'
     */
    variant?: ButtonProps['variant'];
    class?: any;
}
declare const __VLS_export: import("vue").DefineComponent<DashboardSidebarToggleProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<DashboardSidebarToggleProps> & Readonly<{}>, {
    color: "error" | "primary" | "secondary" | "success" | "info" | "warning" | "neutral";
    variant: "link" | "solid" | "outline" | "soft" | "subtle" | "ghost";
    side: "left" | "right";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
