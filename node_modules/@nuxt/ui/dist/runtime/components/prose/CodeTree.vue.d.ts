import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/prose/code-tree';
import type { ComponentConfig } from '../../types/tv';
type ProseCodeTree = ComponentConfig<typeof theme, AppConfig, 'codeTree', 'ui.prose'>;
export interface ProseCodeTreeProps {
    /**
     * The default path to select.
     * @example 'package.json'
     */
    defaultValue?: string;
    /**
     * Expand all directories by default.
     * @defaultValue false
     */
    expandAll?: boolean;
    class?: any;
    ui?: ProseCodeTree['slots'];
}
export interface ProseCodeTreeSlots {
    default(props?: {}): any;
}
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProseCodeTreeProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProseCodeTreeProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProseCodeTreeSlots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
