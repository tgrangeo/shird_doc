import type { PropType } from 'vue';
declare var __VLS_7: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_7) => any;
};
declare const __VLS_component: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    href: {
        type: StringConstructor;
        default: string;
    };
    target: {
        type: PropType<"_blank" | "_parent" | "_self" | "_top" | (string & object) | null | undefined>;
        default: undefined;
        required: false;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    href: {
        type: StringConstructor;
        default: string;
    };
    target: {
        type: PropType<"_blank" | "_parent" | "_self" | "_top" | (string & object) | null | undefined>;
        default: undefined;
        required: false;
    };
}>> & Readonly<{}>, {
    href: string;
    target: "_blank" | "_parent" | "_self" | "_top" | null | undefined;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
