export interface ProseAccordionItemProps {
    label: string;
    description?: string;
    class?: any;
}
export interface ProseAccordionItemSlots {
    default(props?: {}): any;
}
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProseAccordionItemProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProseAccordionItemProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProseAccordionItemSlots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
