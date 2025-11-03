import type { SelectMenuProps } from '../../types';
import type { Locale } from '../../types/locale';
export interface LocaleSelectProps extends /** @vue-ignore */ Pick<SelectMenuProps<any>, 'color' | 'variant' | 'size' | 'trailingIcon' | 'selectedIcon' | 'content' | 'arrow' | 'portal' | 'disabled' | 'ui'> {
    locales?: Locale<any>[];
}
declare const __VLS_export: import("vue").DefineComponent<LocaleSelectProps & {
    modelValue?: string;
}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: string | undefined) => any;
}, string, import("vue").PublicProps, Readonly<LocaleSelectProps & {
    modelValue?: string;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: string | undefined) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
