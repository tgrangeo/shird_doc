declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_component: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    code: {
        type: StringConstructor;
        default: string;
    };
    language: {
        type: StringConstructor;
        default: null;
    };
    filename: {
        type: StringConstructor;
        default: null;
    };
    highlights: {
        type: () => number[];
        default: () => never[];
    };
    meta: {
        type: StringConstructor;
        default: null;
    };
    class: {
        type: StringConstructor;
        default: null;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    code: {
        type: StringConstructor;
        default: string;
    };
    language: {
        type: StringConstructor;
        default: null;
    };
    filename: {
        type: StringConstructor;
        default: null;
    };
    highlights: {
        type: () => number[];
        default: () => never[];
    };
    meta: {
        type: StringConstructor;
        default: null;
    };
    class: {
        type: StringConstructor;
        default: null;
    };
}>> & Readonly<{}>, {
    class: string;
    code: string;
    meta: string;
    language: string;
    highlights: number[];
    filename: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
