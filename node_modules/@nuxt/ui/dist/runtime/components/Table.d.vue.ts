import type { Ref, WatchOptions } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { Cell, Header, RowData, TableMeta } from '@tanstack/table-core';
import type { CellContext, ColumnDef, ColumnFiltersOptions, ColumnFiltersState, ColumnOrderState, ColumnPinningOptions, ColumnPinningState, ColumnSizingInfoState, ColumnSizingOptions, ColumnSizingState, CoreOptions, ExpandedOptions, ExpandedState, FacetedOptions, GlobalFilterOptions, GroupingOptions, GroupingState, HeaderContext, PaginationOptions, PaginationState, Row, RowPinningOptions, RowPinningState, RowSelectionOptions, RowSelectionState, SortingOptions, SortingState, VisibilityOptions, VisibilityState } from '@tanstack/vue-table';
import type { VirtualizerOptions } from '@tanstack/vue-virtual';
import theme from '#build/ui/table';
import type { ComponentConfig } from '../types/tv';
declare module '@tanstack/table-core' {
    interface ColumnMeta<TData extends RowData, TValue> {
        class?: {
            th?: string | ((cell: Header<TData, TValue>) => string);
            td?: string | ((cell: Cell<TData, TValue>) => string);
        };
        style?: {
            th?: string | Record<string, string> | ((cell: Header<TData, TValue>) => string | Record<string, string>);
            td?: string | Record<string, string> | ((cell: Cell<TData, TValue>) => string | Record<string, string>);
        };
        colspan?: {
            td?: string | ((cell: Cell<TData, TValue>) => string);
        };
        rowspan?: {
            td?: string | ((cell: Cell<TData, TValue>) => string);
        };
    }
    interface TableMeta<TData> {
        class?: {
            tr?: string | ((row: Row<TData>) => string);
        };
        style?: {
            tr?: string | Record<string, string> | ((row: Row<TData>) => string | Record<string, string>);
        };
    }
}
type Table = ComponentConfig<typeof theme, AppConfig, 'table'>;
export type TableRow<T> = Row<T>;
export type TableData = RowData;
export type TableColumn<T extends TableData, D = unknown> = ColumnDef<T, D>;
export interface TableOptions<T extends TableData = TableData> extends Omit<CoreOptions<T>, 'data' | 'columns' | 'getCoreRowModel' | 'state' | 'onStateChange' | 'renderFallbackValue'> {
    state?: CoreOptions<T>['state'];
    onStateChange?: CoreOptions<T>['onStateChange'];
    renderFallbackValue?: CoreOptions<T>['renderFallbackValue'];
}
export interface TableProps<T extends TableData = TableData> extends TableOptions<T> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    data?: T[];
    columns?: TableColumn<T>[];
    caption?: string;
    meta?: TableMeta<T>;
    /**
     * Enable virtualization for large datasets.
     * Note: when enabled, the divider between rows and sticky properties are not supported.
     * @defaultValue false
     */
    virtualize?: boolean | (Partial<Omit<VirtualizerOptions<Element, Element>, 'getScrollElement' | 'count' | 'estimateSize' | 'overscan'>> & {
        /**
         * Number of items rendered outside the visible area
         * @defaultValue 12
         */
        overscan?: number;
        /**
         * Estimated size (in px) of each item
         * @defaultValue 65
         */
        estimateSize?: number;
    });
    /**
     * The text to display when the table is empty.
     * @defaultValue t('table.noData')
     */
    empty?: string;
    /**
     * Whether the table should have a sticky header or footer. True for both, 'header' for header only, 'footer' for footer only.
     * Note: this prop is not supported when `virtualize` is true.
     * @defaultValue false
     */
    sticky?: boolean | 'header' | 'footer';
    /** Whether the table should be in loading state. */
    loading?: boolean;
    /**
     * @defaultValue 'primary'
     */
    loadingColor?: Table['variants']['loadingColor'];
    /**
     * @defaultValue 'carousel'
     */
    loadingAnimation?: Table['variants']['loadingAnimation'];
    /**
     * Use the `watchOptions` prop to customize reactivity (for ex: disable deep watching for changes in your data or limiting the max traversal depth). This can improve performance by reducing unnecessary re-renders, but it should be used with caution as it may lead to unexpected behavior if not managed properly.
     * @see [API](https://vuejs.org/api/options-state.html#watch)
     * @see [Guide](https://vuejs.org/guide/essentials/watchers.html)
     * @defaultValue { deep: true }
     */
    watchOptions?: WatchOptions;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/global-filtering#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)
     */
    globalFilterOptions?: Omit<GlobalFilterOptions<T>, 'onGlobalFilterChange'>;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/column-filtering#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
     */
    columnFiltersOptions?: Omit<ColumnFiltersOptions<T>, 'getFilteredRowModel' | 'onColumnFiltersChange'>;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/column-pinning#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
     */
    columnPinningOptions?: Omit<ColumnPinningOptions, 'onColumnPinningChange'>;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/column-sizing#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)
     */
    columnSizingOptions?: Omit<ColumnSizingOptions, 'onColumnSizingChange' | 'onColumnSizingInfoChange'>;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/column-visibility#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
     */
    visibilityOptions?: Omit<VisibilityOptions, 'onColumnVisibilityChange'>;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/sorting#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
     */
    sortingOptions?: Omit<SortingOptions<T>, 'getSortedRowModel' | 'onSortingChange'>;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/grouping#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
     */
    groupingOptions?: Omit<GroupingOptions, 'onGroupingChange'>;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/expanding#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
     */
    expandedOptions?: Omit<ExpandedOptions<T>, 'getExpandedRowModel' | 'onExpandedChange'>;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/row-selection#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/row-selection)
     */
    rowSelectionOptions?: Omit<RowSelectionOptions<T>, 'onRowSelectionChange'>;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/row-pinning#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)
     */
    rowPinningOptions?: Omit<RowPinningOptions<T>, 'onRowPinningChange'>;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/pagination#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
     */
    paginationOptions?: Omit<PaginationOptions, 'onPaginationChange'>;
    /**
     * @see [API](https://tanstack.com/table/v8/docs/api/features/column-faceting#table-options)
     * @see [Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)
     */
    facetedOptions?: FacetedOptions<T>;
    onSelect?: (e: Event, row: TableRow<T>) => void;
    onHover?: (e: Event, row: TableRow<T> | null) => void;
    onContextmenu?: ((e: Event, row: TableRow<T>) => void) | Array<((e: Event, row: TableRow<T>) => void)>;
    class?: any;
    ui?: Table['slots'];
}
type DynamicHeaderSlots<T, K = keyof T> = Record<string, (props: HeaderContext<T, unknown>) => any> & Record<`${K extends string ? K : never}-header`, (props: HeaderContext<T, unknown>) => any>;
type DynamicFooterSlots<T, K = keyof T> = Record<string, (props: HeaderContext<T, unknown>) => any> & Record<`${K extends string ? K : never}-footer`, (props: HeaderContext<T, unknown>) => any>;
type DynamicCellSlots<T, K = keyof T> = Record<string, (props: CellContext<T, unknown>) => any> & Record<`${K extends string ? K : never}-cell`, (props: CellContext<T, unknown>) => any>;
export type TableSlots<T extends TableData = TableData> = {
    'expanded': (props: {
        row: Row<T>;
    }) => any;
    'empty': (props?: {}) => any;
    'loading': (props?: {}) => any;
    'caption': (props?: {}) => any;
    'body-top': (props?: {}) => any;
    'body-bottom': (props?: {}) => any;
} & DynamicHeaderSlots<T> & DynamicFooterSlots<T> & DynamicCellSlots<T>;
declare const __VLS_export: <T extends TableData>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<(TableProps<T> & {
        globalFilter?: string;
        columnFilters?: ColumnFiltersState;
        columnOrder?: ColumnOrderState;
        columnVisibility?: VisibilityState;
        columnPinning?: ColumnPinningState;
        columnSizing?: ColumnSizingState;
        columnSizingInfo?: ColumnSizingInfoState;
        rowSelection?: RowSelectionState;
        rowPinning?: RowPinningState;
        sorting?: SortingState;
        grouping?: GroupingState;
        expanded?: ExpandedState;
        pagination?: PaginationState;
    }) & {
        "onUpdate:globalFilter"?: ((value: string) => any) | undefined;
        "onUpdate:columnFilters"?: ((value: ColumnFiltersState) => any) | undefined;
        "onUpdate:columnOrder"?: ((value: ColumnOrderState) => any) | undefined;
        "onUpdate:columnVisibility"?: ((value: VisibilityState) => any) | undefined;
        "onUpdate:columnPinning"?: ((value: ColumnPinningState) => any) | undefined;
        "onUpdate:columnSizing"?: ((value: ColumnSizingState) => any) | undefined;
        "onUpdate:columnSizingInfo"?: ((value: ColumnSizingInfoState) => any) | undefined;
        "onUpdate:rowSelection"?: ((value: RowSelectionState) => any) | undefined;
        "onUpdate:rowPinning"?: ((value: RowPinningState) => any) | undefined;
        "onUpdate:sorting"?: ((value: SortingState) => any) | undefined;
        "onUpdate:grouping"?: ((value: GroupingState) => any) | undefined;
        "onUpdate:expanded"?: ((value: ExpandedState) => any) | undefined;
        "onUpdate:pagination"?: ((value: PaginationState) => any) | undefined;
    }> & import("vue").PublicProps;
    expose: (exposed: import("vue").ShallowUnwrapRef<{
        readonly $el: any;
        tableRef: Ref<HTMLTableElement | null, HTMLTableElement | null>;
        tableApi: import("@tanstack/table-core").Table<T>;
    }>) => void;
    attrs: any;
    slots: TableSlots<T>;
    emit: ((evt: "update:globalFilter", value: string) => void) & ((evt: "update:columnFilters", value: ColumnFiltersState) => void) & ((evt: "update:columnOrder", value: ColumnOrderState) => void) & ((evt: "update:columnVisibility", value: VisibilityState) => void) & ((evt: "update:columnPinning", value: ColumnPinningState) => void) & ((evt: "update:columnSizing", value: ColumnSizingState) => void) & ((evt: "update:columnSizingInfo", value: ColumnSizingInfoState) => void) & ((evt: "update:rowSelection", value: RowSelectionState) => void) & ((evt: "update:rowPinning", value: RowPinningState) => void) & ((evt: "update:sorting", value: SortingState) => void) & ((evt: "update:grouping", value: GroupingState) => void) & ((evt: "update:expanded", value: ExpandedState) => void) & ((evt: "update:pagination", value: PaginationState) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
