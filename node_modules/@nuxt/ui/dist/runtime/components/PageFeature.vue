<script>
import theme from "#build/ui/page-feature";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { getSlotChildrenText } from "../utils";
import { tv } from "../utils/tv";
import ULink from "./Link.vue";
import UIcon from "./Icon.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  icon: { type: [String, Object], required: false },
  title: { type: String, required: false },
  description: { type: String, required: false },
  orientation: { type: null, required: false, default: "horizontal" },
  to: { type: null, required: false },
  target: { type: [String, Object, null], required: false },
  onClick: { type: Function, required: false },
  class: { type: null, required: false },
  ui: { type: null, required: false }
});
const slots = defineSlots();
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pageFeature || {} })({
  orientation: props.orientation,
  title: !!props.title || !!slots.title
}));
const ariaLabel = computed(() => {
  const slotText = slots.title && getSlotChildrenText(slots.title());
  return (slotText || props.title || "Feature link").trim();
});
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" :class="ui.root({ class: [props.ui?.root, props.class] })" @click="onClick">
    <div v-if="icon || !!slots.leading" :class="ui.leading({ class: props.ui?.leading })">
      <slot name="leading" :ui="ui">
        <UIcon v-if="icon" :name="icon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
      </slot>
    </div>

    <div :class="ui.wrapper({ class: props.ui?.wrapper })">
      <ULink
        v-if="to"
        :aria-label="ariaLabel"
        v-bind="{ to, target, ...$attrs }"
        class="focus:outline-none peer"
        tabindex="-1"
        raw
      >
        <span class="absolute inset-0" aria-hidden="true" />
      </ULink>

      <slot>
        <div v-if="title || !!slots.title" :class="ui.title({ class: props.ui?.title })">
          <slot name="title">
            {{ title }}
          </slot>
        </div>

        <div v-if="description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
          <slot name="description">
            {{ description }}
          </slot>
        </div>
      </slot>
    </div>
  </Primitive>
</template>
