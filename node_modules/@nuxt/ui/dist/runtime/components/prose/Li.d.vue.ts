export interface ProseLiProps {
    class?: any;
}
export interface ProseLiSlots {
    default(props?: {}): any;
}
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProseLiProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProseLiProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProseLiSlots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
