<script>
import theme from "#build/ui/content/content-search-button";
</script>

<script setup>
import { computed, toRef } from "vue";
import { useForwardProps } from "reka-ui";
import { defu } from "defu";
import { reactivePick, createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useContentSearch } from "../../composables/useContentSearch";
import { useLocale } from "../../composables/useLocale";
import { omit, transformUI } from "../../utils";
import { tv } from "../../utils/tv";
import UButton from "../Button.vue";
import UKbd from "../Kbd.vue";
import UTooltip from "../Tooltip.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  icon: { type: [String, Object], required: false },
  label: { type: String, required: false },
  color: { type: null, required: false, default: "neutral" },
  variant: { type: null, required: false },
  size: { type: null, required: false },
  collapsed: { type: Boolean, required: false, default: true },
  tooltip: { type: [Boolean, Object], required: false, default: false },
  kbds: { type: Array, required: false, default: () => ["meta", "k"] },
  ui: { type: void 0, required: false },
  class: { type: null, required: false }
});
const slots = defineSlots();
const [DefineButtonTemplate, ReuseButtonTemplate] = createReusableTemplate();
const getProxySlots = () => omit(slots, ["trailing"]);
const rootProps = useForwardProps(reactivePick(props, "color", "size"));
const tooltipProps = toRef(() => defu(typeof props.tooltip === "boolean" ? {} : props.tooltip, { delayDuration: 0, content: { side: "right" } }));
const { t } = useLocale();
const { open } = useContentSearch();
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.contentSearchButton || {} })());
</script>

<template>
  <DefineButtonTemplate>
    <UButton
      :icon="icon || appConfig.ui.icons.search"
      :label="label || t('contentSearchButton.label')"
      :variant="variant || (collapsed ? 'ghost' : 'outline')"
      v-bind="{
  ...rootProps,
  ...collapsed ? {
    'square': true,
    'label': void 0,
    'aria-label': label || t('contentSearchButton.label')
  } : {},
  ...$attrs
}"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
      :ui="transformUI(ui, props.ui)"
      @click="open = true"
    >
      <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>

      <template v-if="!collapsed" #trailing="{ ui: uiProxy }">
        <div :class="ui.trailing({ class: props.ui?.trailing })">
          <slot name="trailing" :ui="uiProxy">
            <template v-if="kbds?.length">
              <UKbd v-for="(kbd, index) in kbds" :key="index" variant="subtle" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
            </template>
          </slot>
        </div>
      </template>
    </UButton>
  </DefineButtonTemplate>

  <UTooltip v-if="collapsed && tooltip" :text="label || t('contentSearchButton.label')" v-bind="tooltipProps">
    <ReuseButtonTemplate />
  </UTooltip>
  <ReuseButtonTemplate v-else />
</template>
