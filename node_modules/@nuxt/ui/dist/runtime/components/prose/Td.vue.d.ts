export interface ProseTdProps {
    class?: any;
}
export interface ProseTdSlots {
    default(props?: {}): any;
}
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProseTdProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProseTdProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProseTdSlots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
