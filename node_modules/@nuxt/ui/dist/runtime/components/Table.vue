<script>
import theme from "#build/ui/table";
</script>

<script setup>
import { computed, ref, watch, toRef } from "vue";
import { Primitive } from "reka-ui";
import { upperFirst } from "scule";
import { defu } from "defu";
import { FlexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, getExpandedRowModel, useVueTable } from "@tanstack/vue-table";
import { useVirtualizer } from "@tanstack/vue-virtual";
import { reactiveOmit, createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useLocale } from "../composables/useLocale";
import { tv } from "../utils/tv";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  data: { type: Array, required: false },
  columns: { type: Array, required: false },
  caption: { type: String, required: false },
  meta: { type: Object, required: false },
  virtualize: { type: [Boolean, Object], required: false, default: false },
  empty: { type: String, required: false },
  sticky: { type: [Boolean, String], required: false },
  loading: { type: Boolean, required: false },
  loadingColor: { type: null, required: false },
  loadingAnimation: { type: null, required: false },
  watchOptions: { type: Object, required: false, default: () => ({
    deep: true
  }) },
  globalFilterOptions: { type: Object, required: false },
  columnFiltersOptions: { type: Object, required: false },
  columnPinningOptions: { type: Object, required: false },
  columnSizingOptions: { type: Object, required: false },
  visibilityOptions: { type: Object, required: false },
  sortingOptions: { type: Object, required: false },
  groupingOptions: { type: Object, required: false },
  expandedOptions: { type: Object, required: false },
  rowSelectionOptions: { type: Object, required: false },
  rowPinningOptions: { type: Object, required: false },
  paginationOptions: { type: Object, required: false },
  facetedOptions: { type: Object, required: false },
  onSelect: { type: Function, required: false },
  onHover: { type: Function, required: false },
  onContextmenu: { type: [Function, Array], required: false },
  class: { type: null, required: false },
  ui: { type: null, required: false },
  state: { type: Object, required: false },
  onStateChange: { type: Function, required: false },
  renderFallbackValue: { type: null, required: false },
  _features: { type: Array, required: false },
  autoResetAll: { type: Boolean, required: false },
  debugAll: { type: Boolean, required: false },
  debugCells: { type: Boolean, required: false },
  debugColumns: { type: Boolean, required: false },
  debugHeaders: { type: Boolean, required: false },
  debugRows: { type: Boolean, required: false },
  debugTable: { type: Boolean, required: false },
  defaultColumn: { type: Object, required: false },
  getRowId: { type: Function, required: false },
  getSubRows: { type: Function, required: false },
  initialState: { type: Object, required: false },
  mergeOptions: { type: Function, required: false }
});
const slots = defineSlots();
const { t } = useLocale();
const appConfig = useAppConfig();
const data = ref(props.data ?? []);
const meta = computed(() => props.meta ?? {});
const columns = computed(() => processColumns(props.columns ?? Object.keys(data.value[0] ?? {}).map((accessorKey) => ({ accessorKey, header: upperFirst(accessorKey) }))));
function processColumns(columns2) {
  return columns2.map((column) => {
    const col = { ...column };
    if ("columns" in col && col.columns) {
      col.columns = processColumns(col.columns);
    }
    if (!col.cell) {
      col.cell = ({ getValue }) => {
        const value = getValue();
        if (value === "" || value === null || value === void 0) {
          return "\xA0";
        }
        return String(value);
      };
    }
    return col;
  });
}
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.table || {} })({
  sticky: props.virtualize ? false : props.sticky,
  loading: props.loading,
  loadingColor: props.loadingColor,
  loadingAnimation: props.loadingAnimation,
  virtualize: !!props.virtualize
}));
const [DefineTableTemplate, ReuseTableTemplate] = createReusableTemplate();
const [DefineRowTemplate, ReuseRowTemplate] = createReusableTemplate({
  props: {
    row: {
      type: Object,
      required: true
    },
    style: {
      type: Object,
      required: false
    }
  }
});
const hasFooter = computed(() => {
  function hasFooterRecursive(columns2) {
    for (const column of columns2) {
      if ("footer" in column) {
        return true;
      }
      if ("columns" in column && hasFooterRecursive(column.columns)) {
        return true;
      }
    }
    return false;
  }
  return hasFooterRecursive(columns.value);
});
const globalFilterState = defineModel("globalFilter", { type: String, ...{ default: void 0 } });
const columnFiltersState = defineModel("columnFilters", { type: Array, ...{ default: [] } });
const columnOrderState = defineModel("columnOrder", { type: Array, ...{ default: [] } });
const columnVisibilityState = defineModel("columnVisibility", { type: Object, ...{ default: {} } });
const columnPinningState = defineModel("columnPinning", { type: Object, ...{ default: {} } });
const columnSizingState = defineModel("columnSizing", { type: Object, ...{ default: {} } });
const columnSizingInfoState = defineModel("columnSizingInfo", { type: Object, ...{ default: {} } });
const rowSelectionState = defineModel("rowSelection", { type: Object, ...{ default: {} } });
const rowPinningState = defineModel("rowPinning", { type: Object, ...{ default: {} } });
const sortingState = defineModel("sorting", { type: Array, ...{ default: [] } });
const groupingState = defineModel("grouping", { type: Array, ...{ default: [] } });
const expandedState = defineModel("expanded", { type: [Boolean, Object], ...{ default: {} } });
const paginationState = defineModel("pagination", { type: Object, ...{ default: {} } });
const rootRef = ref();
const tableRef = ref(null);
const tableApi = useVueTable({
  ...reactiveOmit(props, "as", "data", "columns", "virtualize", "caption", "sticky", "loading", "loadingColor", "loadingAnimation", "class", "ui"),
  data,
  get columns() {
    return columns.value;
  },
  meta: meta.value,
  getCoreRowModel: getCoreRowModel(),
  ...props.globalFilterOptions || {},
  onGlobalFilterChange: (updaterOrValue) => valueUpdater(updaterOrValue, globalFilterState),
  ...props.columnFiltersOptions || {},
  getFilteredRowModel: getFilteredRowModel(),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFiltersState),
  onColumnOrderChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnOrderState),
  ...props.visibilityOptions || {},
  onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibilityState),
  ...props.columnPinningOptions || {},
  onColumnPinningChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnPinningState),
  ...props.columnSizingOptions || {},
  onColumnSizingChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnSizingState),
  onColumnSizingInfoChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnSizingInfoState),
  ...props.rowSelectionOptions || {},
  onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelectionState),
  ...props.rowPinningOptions || {},
  onRowPinningChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowPinningState),
  ...props.sortingOptions || {},
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sortingState),
  ...props.groupingOptions || {},
  onGroupingChange: (updaterOrValue) => valueUpdater(updaterOrValue, groupingState),
  ...props.expandedOptions || {},
  getExpandedRowModel: getExpandedRowModel(),
  onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expandedState),
  ...props.paginationOptions || {},
  onPaginationChange: (updaterOrValue) => valueUpdater(updaterOrValue, paginationState),
  ...props.facetedOptions || {},
  state: {
    get globalFilter() {
      return globalFilterState.value;
    },
    get columnFilters() {
      return columnFiltersState.value;
    },
    get columnOrder() {
      return columnOrderState.value;
    },
    get columnVisibility() {
      return columnVisibilityState.value;
    },
    get columnPinning() {
      return columnPinningState.value;
    },
    get expanded() {
      return expandedState.value;
    },
    get rowSelection() {
      return rowSelectionState.value;
    },
    get sorting() {
      return sortingState.value;
    },
    get grouping() {
      return groupingState.value;
    },
    get rowPinning() {
      return rowPinningState.value;
    },
    get columnSizing() {
      return columnSizingState.value;
    },
    get columnSizingInfo() {
      return columnSizingInfoState.value;
    },
    get pagination() {
      return paginationState.value;
    }
  }
});
const rows = computed(() => tableApi.getRowModel().rows);
const virtualizerProps = toRef(() => defu(typeof props.virtualize === "boolean" ? {} : props.virtualize, {
  estimateSize: 65,
  overscan: 12
}));
const virtualizer = !!props.virtualize && useVirtualizer({
  ...virtualizerProps.value,
  get count() {
    return rows.value.length;
  },
  getScrollElement: () => rootRef.value?.$el,
  estimateSize: () => virtualizerProps.value.estimateSize
});
function valueUpdater(updaterOrValue, ref2) {
  ref2.value = typeof updaterOrValue === "function" ? updaterOrValue(ref2.value) : updaterOrValue;
}
function onRowSelect(e, row) {
  if (!props.onSelect) {
    return;
  }
  const target = e.target;
  const isInteractive = target.closest("button") || target.closest("a");
  if (isInteractive) {
    return;
  }
  e.preventDefault();
  e.stopPropagation();
  props.onSelect(e, row);
}
function onRowHover(e, row) {
  if (!props.onHover) {
    return;
  }
  props.onHover(e, row);
}
function onRowContextmenu(e, row) {
  if (!props.onContextmenu) {
    return;
  }
  if (Array.isArray(props.onContextmenu)) {
    props.onContextmenu.forEach((fn) => fn(e, row));
  } else {
    props.onContextmenu(e, row);
  }
}
function resolveValue(prop, arg) {
  if (typeof prop === "function") {
    return prop(arg);
  }
  return prop;
}
watch(() => props.data, () => {
  data.value = props.data ? [...props.data] : [];
}, props.watchOptions);
defineExpose({
  get $el() {
    return rootRef.value?.$el;
  },
  tableRef,
  tableApi
});
</script>

<template>
  <DefineRowTemplate v-slot="{ row, style }">
    <tr
      :data-selected="row.getIsSelected()"
      :data-selectable="!!props.onSelect || !!props.onHover || !!props.onContextmenu"
      :data-expanded="row.getIsExpanded()"
      :role="props.onSelect ? 'button' : void 0"
      :tabindex="props.onSelect ? 0 : void 0"
      :class="ui.tr({
  class: [
    props.ui?.tr,
    resolveValue(tableApi.options.meta?.class?.tr, row)
  ]
})"
      :style="[resolveValue(tableApi.options.meta?.style?.tr, row), style]"
      @click="onRowSelect($event, row)"
      @pointerenter="onRowHover($event, row)"
      @pointerleave="onRowHover($event, null)"
      @contextmenu="onRowContextmenu($event, row)"
    >
      <td
        v-for="cell in row.getVisibleCells()"
        :key="cell.id"
        :data-pinned="cell.column.getIsPinned()"
        :colspan="resolveValue(cell.column.columnDef.meta?.colspan?.td, cell)"
        :rowspan="resolveValue(cell.column.columnDef.meta?.rowspan?.td, cell)"
        :class="ui.td({
  class: [
    props.ui?.td,
    resolveValue(cell.column.columnDef.meta?.class?.td, cell)
  ],
  pinned: !!cell.column.getIsPinned()
})"
        :style="resolveValue(cell.column.columnDef.meta?.style?.td, cell)"
      >
        <slot :name="`${cell.column.id}-cell`" v-bind="cell.getContext()">
          <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
        </slot>
      </td>
    </tr>

    <tr v-if="row.getIsExpanded()" :class="ui.tr({ class: [props.ui?.tr] })">
      <td :colspan="row.getAllCells().length" :class="ui.td({ class: [props.ui?.td] })">
        <slot name="expanded" :row="row" />
      </td>
    </tr>
  </DefineRowTemplate>

  <DefineTableTemplate>
    <table ref="tableRef" :class="ui.base({ class: [props.ui?.base] })">
      <caption v-if="caption || !!slots.caption" :class="ui.caption({ class: [props.ui?.caption] })">
        <slot name="caption">
          {{ caption }}
        </slot>
      </caption>

      <thead :class="ui.thead({ class: [props.ui?.thead] })">
        <tr v-for="headerGroup in tableApi.getHeaderGroups()" :key="headerGroup.id" :class="ui.tr({ class: [props.ui?.tr] })">
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            :data-pinned="header.column.getIsPinned()"
            :scope="header.colSpan > 1 ? 'colgroup' : 'col'"
            :colspan="header.colSpan > 1 ? header.colSpan : void 0"
            :rowspan="header.rowSpan > 1 ? header.rowSpan : void 0"
            :class="ui.th({
  class: [
    props.ui?.th,
    resolveValue(header.column.columnDef.meta?.class?.th, header)
  ],
  pinned: !!header.column.getIsPinned()
})"
          >
            <slot :name="`${header.id}-header`" v-bind="header.getContext()">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
            </slot>
          </th>
        </tr>

        <tr :class="ui.separator({ class: [props.ui?.separator] })" />
      </thead>

      <tbody :class="ui.tbody({ class: [props.ui?.tbody] })">
        <slot name="body-top" />

        <template v-if="rows.length">
          <template v-if="virtualizer">
            <template v-for="(virtualRow, index) in virtualizer.getVirtualItems()" :key="rows[virtualRow.index]?.id">
              <ReuseRowTemplate
                :row="rows[virtualRow.index]"
                :style="{
  height: `${virtualRow.size}px`,
  transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`
}"
              />
            </template>
          </template>

          <template v-else>
            <ReuseRowTemplate v-for="row in rows" :key="row.id" :row="row" />
          </template>
        </template>

        <tr v-else-if="loading && !!slots['loading']">
          <td :colspan="tableApi.getAllLeafColumns().length" :class="ui.loading({ class: props.ui?.loading })">
            <slot name="loading" />
          </td>
        </tr>

        <tr v-else>
          <td :colspan="tableApi.getAllLeafColumns().length" :class="ui.empty({ class: props.ui?.empty })">
            <slot name="empty">
              {{ empty || t("table.noData") }}
            </slot>
          </td>
        </tr>

        <slot name="body-bottom" />
      </tbody>

      <tfoot
        v-if="hasFooter"
        :class="ui.tfoot({ class: [props.ui?.tfoot] })"
        :style="virtualizer ? {
  transform: `translateY(${virtualizer.getTotalSize() - virtualizer.getVirtualItems().length * virtualizerProps.estimateSize}px)`
} : void 0"
      >
        <tr :class="ui.separator({ class: [props.ui?.separator] })" />

        <tr v-for="footerGroup in tableApi.getFooterGroups()" :key="footerGroup.id" :class="ui.tr({ class: [props.ui?.tr] })">
          <th
            v-for="header in footerGroup.headers"
            :key="header.id"
            :data-pinned="header.column.getIsPinned()"
            :colspan="header.colSpan > 1 ? header.colSpan : void 0"
            :rowspan="header.rowSpan > 1 ? header.rowSpan : void 0"
            :class="ui.th({
  class: [
    props.ui?.th,
    resolveValue(header.column.columnDef.meta?.class?.th, header)
  ],
  pinned: !!header.column.getIsPinned()
})"
            :style="resolveValue(header.column.columnDef.meta?.style?.th, header)"
          >
            <slot :name="`${header.id}-footer`" v-bind="header.getContext()">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.footer" :props="header.getContext()" />
            </slot>
          </th>
        </tr>
      </tfoot>
    </table>
  </DefineTableTemplate>

  <Primitive ref="rootRef" :as="as" v-bind="$attrs" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div
      v-if="virtualizer"
      :style="{
  height: `${virtualizer.getTotalSize()}px`
}"
    >
      <ReuseTableTemplate />
    </div>
    <ReuseTableTemplate v-else />
  </Primitive>
</template>
