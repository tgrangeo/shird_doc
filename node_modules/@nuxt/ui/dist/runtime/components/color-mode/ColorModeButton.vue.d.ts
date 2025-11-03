import type { ButtonProps } from '@nuxt/ui';
export interface ColorModeButtonProps extends /** @vue-ignore */ Pick<ButtonProps, 'as' | 'size' | 'disabled' | 'ui'> {
    /**
     * @defaultValue 'neutral'
     */
    color?: ButtonProps['color'];
    /**
     * @defaultValue 'ghost'
     */
    variant?: ButtonProps['variant'];
}
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ColorModeButtonProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ColorModeButtonProps> & Readonly<{}>, {
    color: ButtonProps["color"];
    variant: ButtonProps["variant"];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, {
    fallback(props?: {}): any;
}>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
