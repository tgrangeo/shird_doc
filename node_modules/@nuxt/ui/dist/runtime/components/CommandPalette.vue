<script>
import theme from "#build/ui/command-palette";
</script>

<script setup>
import { computed, ref, useTemplateRef, toRef } from "vue";
import { ListboxRoot, ListboxFilter, ListboxContent, ListboxGroup, ListboxGroupLabel, ListboxVirtualizer, ListboxItem, ListboxItemIndicator, useForwardProps, useForwardPropsEmits } from "reka-ui";
import { defu } from "defu";
import { reactivePick, createReusableTemplate } from "@vueuse/core";
import { useFuse } from "@vueuse/integrations/useFuse";
import { useAppConfig } from "#imports";
import { useLocale } from "../composables/useLocale";
import { omit, get } from "../utils";
import { tv } from "../utils/tv";
import { highlight } from "../utils/fuse";
import { pickLinkProps } from "../utils/link";
import UIcon from "./Icon.vue";
import UAvatar from "./Avatar.vue";
import UButton from "./Button.vue";
import UChip from "./Chip.vue";
import ULinkBase from "./LinkBase.vue";
import ULink from "./Link.vue";
import UInput from "./Input.vue";
import UKbd from "./Kbd.vue";
const props = defineProps({
  as: { type: null, required: false },
  icon: { type: [String, Object], required: false },
  trailingIcon: { type: [String, Object], required: false },
  selectedIcon: { type: [String, Object], required: false },
  childrenIcon: { type: [String, Object], required: false },
  placeholder: { type: String, required: false },
  autofocus: { type: Boolean, required: false, default: true },
  close: { type: [Boolean, Object], required: false },
  closeIcon: { type: [String, Object], required: false },
  back: { type: [Boolean, Object], required: false, default: true },
  backIcon: { type: [String, Object], required: false },
  groups: { type: Array, required: false },
  fuse: { type: Object, required: false },
  virtualize: { type: [Boolean, Object], required: false, default: false },
  labelKey: { type: null, required: false, default: "label" },
  descriptionKey: { type: null, required: false, default: "description" },
  preserveGroupOrder: { type: Boolean, required: false, default: false },
  class: { type: null, required: false },
  ui: { type: null, required: false },
  multiple: { type: Boolean, required: false },
  disabled: { type: Boolean, required: false },
  modelValue: { type: null, required: false, default: "" },
  defaultValue: { type: null, required: false },
  highlightOnHover: { type: Boolean, required: false, default: true },
  selectionBehavior: { type: String, required: false },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: [String, Object], required: false }
});
const emits = defineEmits(["update:modelValue", "highlight", "entryFocus", "leave", "update:open"]);
const slots = defineSlots();
const searchTerm = defineModel("searchTerm", { type: String, ...{ default: "" } });
const { t } = useLocale();
const appConfig = useAppConfig();
const rootProps = useForwardPropsEmits(reactivePick(props, "as", "disabled", "multiple", "modelValue", "defaultValue", "highlightOnHover"), emits);
const inputProps = useForwardProps(reactivePick(props, "loading"));
const virtualizerProps = toRef(() => !!props.virtualize && defu(typeof props.virtualize === "boolean" ? {} : props.virtualize, { estimateSize: 32 }));
const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate({
  props: {
    item: {
      type: Object,
      required: true
    },
    group: {
      type: Object,
      required: false
    },
    index: {
      type: Number,
      required: false
    }
  }
});
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.commandPalette || {} })({
  virtualize: !!props.virtualize
}));
const fuse = computed(() => defu({}, props.fuse, {
  fuseOptions: {
    ignoreLocation: true,
    threshold: 0.1,
    keys: [props.labelKey, "suffix"]
  },
  resultLimit: 12,
  matchAllWhenSearchEmpty: true
}));
const history = ref([]);
const placeholder = computed(() => history.value[history.value.length - 1]?.placeholder || props.placeholder || t("commandPalette.placeholder"));
const groups = computed(() => history.value?.length ? [history.value[history.value.length - 1]] : props.groups);
const items = computed(() => groups.value?.filter((group) => {
  if (!group.id) {
    console.warn(`[@nuxt/ui] CommandPalette group is missing an \`id\` property`);
    return false;
  }
  if (group.ignoreFilter) {
    return false;
  }
  return true;
})?.flatMap((group) => group.items?.map((item) => ({ ...item, group: group.id })) || []) || []);
const { results: fuseResults } = useFuse(searchTerm, items, fuse);
function getGroupWithItems(group, items2) {
  if (group?.postFilter && typeof group.postFilter === "function") {
    items2 = group.postFilter(searchTerm.value, items2);
  }
  return {
    ...group,
    items: items2.slice(0, fuse.value.resultLimit).map((item) => {
      return {
        ...item,
        labelHtml: highlight(item, searchTerm.value, props.labelKey),
        suffixHtml: highlight(item, searchTerm.value, void 0, [props.labelKey])
      };
    })
  };
}
const filteredGroups = computed(() => {
  const groupsById = fuseResults.value.reduce((acc, result) => {
    const { item, matches } = result;
    if (!item.group) {
      return acc;
    }
    acc[item.group] ||= [];
    acc[item.group]?.push({ ...item, matches });
    return acc;
  }, {});
  if (props.preserveGroupOrder) {
    const processedGroups = [];
    for (const group of groups.value || []) {
      if (!group.items?.length) {
        continue;
      }
      const items2 = group.ignoreFilter ? group.items : groupsById[group.id];
      if (items2?.length) {
        processedGroups.push(getGroupWithItems(group, items2));
      }
    }
    return processedGroups;
  }
  const fuseGroups = Object.entries(groupsById).map(([id, items2]) => {
    const group = groups.value?.find((group2) => group2.id === id);
    if (!group) {
      return;
    }
    return getGroupWithItems(group, items2);
  }).filter((group) => !!group);
  const nonFuseGroups = groups.value?.map((group, index) => ({ ...group, index }))?.filter((group) => group.ignoreFilter && group.items?.length)?.map((group) => ({ ...getGroupWithItems(group, group.items || []), index: group.index })) || [];
  return nonFuseGroups.reduce((acc, group) => {
    acc.splice(group.index, 0, group);
    return acc;
  }, [...fuseGroups]);
});
const filteredItems = computed(() => filteredGroups.value.flatMap((group) => group.items || []));
const listboxRootRef = useTemplateRef("listboxRootRef");
function navigate(item) {
  if (!item.children?.length) {
    return;
  }
  history.value.push({
    id: `history-${history.value.length}`,
    label: item.label,
    slot: item.slot,
    placeholder: item.placeholder,
    items: item.children
  });
  searchTerm.value = "";
  listboxRootRef.value?.highlightFirstItem();
}
function navigateBack() {
  if (!history.value.length) {
    return;
  }
  history.value.pop();
  searchTerm.value = "";
  listboxRootRef.value?.highlightFirstItem();
}
function onBackspace() {
  if (!searchTerm.value) {
    navigateBack();
  }
}
function onSelect(e, item) {
  if (item.children?.length) {
    e.preventDefault();
    navigate(item);
  } else {
    item.onSelect?.(e);
  }
}
</script>

<template>
  <DefineItemTemplate v-slot="{ item, index, group }">
    <ListboxItem
      :value="omit(item, ['matches', 'group', 'onSelect', 'labelHtml', 'suffixHtml', 'children'])"
      :disabled="item.disabled"
      as-child
      @select="onSelect($event, item)"
    >
      <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(item)" custom>
        <ULinkBase v-bind="slotProps" :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class], active: active || item.active })">
          <slot :name="item.slot || group?.slot || 'item'" :item="item" :index="index" :ui="ui">
            <slot :name="item.slot ? `${item.slot}-leading` : group?.slot ? `${group.slot}-leading` : `item-leading`" :item="item" :index="index" :ui="ui">
              <UIcon v-if="item.loading" :name="loadingIcon || appConfig.ui.icons.loading" :class="ui.itemLeadingIcon({ class: [props.ui?.itemLeadingIcon, item.ui?.itemLeadingIcon], loading: true })" />
              <UIcon v-else-if="item.icon" :name="item.icon" :class="ui.itemLeadingIcon({ class: [props.ui?.itemLeadingIcon, item.ui?.itemLeadingIcon], active: active || item.active })" />
              <UAvatar v-else-if="item.avatar" :size="item.ui?.itemLeadingAvatarSize || props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()" v-bind="item.avatar" :class="ui.itemLeadingAvatar({ class: [props.ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar], active: active || item.active })" />
              <UChip
                v-else-if="item.chip"
                :size="item.ui?.itemLeadingChipSize || props.ui?.itemLeadingChipSize || ui.itemLeadingChipSize()"
                inset
                standalone
                v-bind="item.chip"
                :class="ui.itemLeadingChip({ class: [props.ui?.itemLeadingChip, item.ui?.itemLeadingChip], active: active || item.active })"
              />
            </slot>

            <span v-if="item.prefix || (item.labelHtml || get(item, props.labelKey)) || (item.suffixHtml || item.suffix) || !!slots[item.slot ? `${item.slot}-label` : group?.slot ? `${group.slot}-label` : `item-label`] || (get(item, props.descriptionKey) || !!slots[item.slot ? `${item.slot}-description` : group?.slot ? `${group.slot}-description` : `item-description`])" :class="ui.itemWrapper({ class: [props.ui?.itemWrapper, item.ui?.itemWrapper] })">
              <span :class="ui.itemLabel({ class: [props.ui?.itemLabel, item.ui?.itemLabel], active: active || item.active })">
                <slot :name="item.slot ? `${item.slot}-label` : group?.slot ? `${group.slot}-label` : `item-label`" :item="item" :index="index" :ui="ui">
                  <span v-if="item.prefix" :class="ui.itemLabelPrefix({ class: [props.ui?.itemLabelPrefix, item.ui?.itemLabelPrefix] })">{{ item.prefix }}</span>

                  <span :class="ui.itemLabelBase({ class: [props.ui?.itemLabelBase, item.ui?.itemLabelBase], active: active || item.active })" v-html="item.labelHtml || get(item, props.labelKey)" />

                  <span :class="ui.itemLabelSuffix({ class: [props.ui?.itemLabelSuffix, item.ui?.itemLabelSuffix], active: active || item.active })" v-html="item.suffixHtml || item.suffix" />
                </slot>
              </span>

              <span v-if="get(item, props.descriptionKey)" :class="ui.itemDescription({ class: [props.ui?.itemDescription, item.ui?.itemDescription] })">
                <slot :name="item.slot ? `${item.slot}-description` : group?.slot ? `${group.slot}-description` : `item-description`" :item="item" :index="index" :ui="ui">
                  {{ get(item, props.descriptionKey) }}
                </slot>
              </span>
            </span>

            <span :class="ui.itemTrailing({ class: [props.ui?.itemTrailing, item.ui?.itemTrailing] })">
              <slot :name="item.slot ? `${item.slot}-trailing` : group?.slot ? `${group.slot}-trailing` : `item-trailing`" :item="item" :index="index" :ui="ui">
                <UIcon
                  v-if="item.children && item.children.length > 0"
                  :name="childrenIcon || appConfig.ui.icons.chevronRight"
                  :class="ui.itemTrailingIcon({ class: [props.ui?.itemTrailingIcon, item.ui?.itemTrailingIcon] })"
                />

                <span v-else-if="item.kbds?.length" :class="ui.itemTrailingKbds({ class: [props.ui?.itemTrailingKbds, item.ui?.itemTrailingKbds] })">
                  <UKbd v-for="(kbd, kbdIndex) in item.kbds" :key="kbdIndex" :size="item.ui?.itemTrailingKbdsSize || props.ui?.itemTrailingKbdsSize || ui.itemTrailingKbdsSize()" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
                </span>

                <UIcon v-else-if="group?.highlightedIcon" :name="group.highlightedIcon" :class="ui.itemTrailingHighlightedIcon({ class: [props.ui?.itemTrailingHighlightedIcon, item.ui?.itemTrailingHighlightedIcon] })" />
              </slot>

              <ListboxItemIndicator v-if="!item.children?.length" as-child>
                <UIcon :name="selectedIcon || appConfig.ui.icons.check" :class="ui.itemTrailingIcon({ class: [props.ui?.itemTrailingIcon, item.ui?.itemTrailingIcon] })" />
              </ListboxItemIndicator>
            </span>
          </slot>
        </ULinkBase>
      </ULink>
    </ListboxItem>
  </DefineItemTemplate>

  <ListboxRoot v-bind="rootProps" ref="listboxRootRef" :selection-behavior="selectionBehavior" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <ListboxFilter v-model="searchTerm" as-child>
      <UInput
        :placeholder="placeholder"
        variant="none"
        :autofocus="autofocus"
        v-bind="inputProps"
        :loading-icon="loadingIcon"
        :trailing-icon="trailingIcon"
        :icon="icon || appConfig.ui.icons.search"
        :class="ui.input({ class: props.ui?.input })"
        @keydown.backspace="onBackspace"
      >
        <template v-if="history?.length && (back || !!slots.back)" #leading>
          <slot name="back" :ui="ui">
            <UButton
              :icon="backIcon || appConfig.ui.icons.arrowLeft"
              color="neutral"
              variant="link"
              :aria-label="t('commandPalette.back')"
              v-bind="typeof back === 'object' ? back : {}"
              :class="ui.back({ class: props.ui?.back })"
              @click="navigateBack"
            />
          </slot>
        </template>

        <template v-if="close || !!slots.close" #trailing>
          <slot name="close" :ui="ui">
            <UButton
              v-if="close"
              :icon="closeIcon || appConfig.ui.icons.close"
              color="neutral"
              variant="ghost"
              :aria-label="t('commandPalette.close')"
              v-bind="typeof close === 'object' ? close : {}"
              :class="ui.close({ class: props.ui?.close })"
              @click="emits('update:open', false)"
            />
          </slot>
        </template>
      </UInput>
    </ListboxFilter>

    <ListboxContent :class="ui.content({ class: props.ui?.content })">
      <div v-if="filteredGroups?.length" role="presentation" :class="ui.viewport({ class: props.ui?.viewport })">
        <ListboxVirtualizer
          v-if="!!virtualize"
          v-slot="{ option: item, virtualItem }"
          :options="filteredItems"
          :text-content="(item2) => get(item2, props.labelKey)"
          v-bind="virtualizerProps"
        >
          <ReuseItemTemplate :item="item" :index="virtualItem.index" />
        </ListboxVirtualizer>

        <template v-else>
          <ListboxGroup v-for="group in filteredGroups" :key="`group-${group.id}`" :class="ui.group({ class: props.ui?.group })">
            <ListboxGroupLabel v-if="get(group, props.labelKey)" :class="ui.label({ class: props.ui?.label })">
              {{ get(group, props.labelKey) }}
            </ListboxGroupLabel>

            <ReuseItemTemplate
              v-for="(item, index) in group.items"
              :key="`group-${group.id}-${index}`"
              :item="item"
              :index="index"
              :group="group"
            />
          </ListboxGroup>
        </template>
      </div>

      <div v-else :class="ui.empty({ class: props.ui?.empty })">
        <slot name="empty" :search-term="searchTerm">
          {{ searchTerm ? t("commandPalette.noMatch", { searchTerm }) : t("commandPalette.noData") }}
        </slot>
      </div>
    </ListboxContent>

    <div v-if="!!slots.footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer" :ui="ui" />
    </div>
  </ListboxRoot>
</template>
