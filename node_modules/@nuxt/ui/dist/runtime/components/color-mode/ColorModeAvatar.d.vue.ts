import type { AvatarProps } from '@nuxt/ui';
export interface ColorModeAvatarProps extends /** @vue-ignore */ Omit<AvatarProps, 'src'> {
    light: string;
    dark: string;
}
declare const __VLS_export: import("vue").DefineComponent<{}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
