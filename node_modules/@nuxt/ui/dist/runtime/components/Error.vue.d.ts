import type { AppConfig } from '@nuxt/schema';
import type { NuxtError } from '#app';
import theme from '#build/ui/error';
import type { ButtonProps } from '../types';
import type { ComponentConfig } from '../types/tv';
type Error = ComponentConfig<typeof theme, AppConfig, 'error'>;
export interface ErrorProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    error?: Partial<NuxtError & {
        message: string;
    }>;
    /**
     * The URL to redirect to when the error is cleared.
     * @defaultValue '/'
     */
    redirect?: string;
    /**
     * Display a button to clear the error in the links slot.
     * `{ size: 'lg', color: 'primary', variant: 'solid', label: 'Back to home' }`{lang="ts-type"}
     * @defaultValue true
     */
    clear?: boolean | Partial<ButtonProps>;
    class?: any;
    ui?: Error['slots'];
}
export interface ErrorSlots {
    default(props?: {}): any;
    statusCode(props?: {}): any;
    statusMessage(props?: {}): any;
    message(props?: {}): any;
    links(props?: {}): any;
}
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ErrorProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ErrorProps> & Readonly<{}>, {
    clear: boolean | Partial<ButtonProps>;
    redirect: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ErrorSlots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
