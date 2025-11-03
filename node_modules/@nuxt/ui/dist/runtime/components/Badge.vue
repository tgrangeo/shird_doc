<script>
import theme from "#build/ui/badge";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useFieldGroup } from "../composables/useFieldGroup";
import { useComponentIcons } from "../composables/useComponentIcons";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
import UAvatar from "./Avatar.vue";
const props = defineProps({
  as: { type: null, required: false, default: "span" },
  label: { type: [String, Number], required: false },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  size: { type: null, required: false },
  square: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: null, required: false },
  icon: { type: [String, Object], required: false },
  avatar: { type: Object, required: false },
  leading: { type: Boolean, required: false },
  leadingIcon: { type: [String, Object], required: false },
  trailing: { type: Boolean, required: false },
  trailingIcon: { type: [String, Object], required: false }
});
const slots = defineSlots();
const appConfig = useAppConfig();
const { orientation, size: fieldGroupSize } = useFieldGroup(props);
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.badge || {} })({
  color: props.color,
  variant: props.variant,
  size: fieldGroupSize.value || props.size,
  square: props.square || !slots.default && !props.label,
  fieldGroup: orientation.value
}));
</script>

<template>
  <Primitive :as="as" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot name="leading" :ui="ui">
      <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
      <UAvatar v-else-if="!!avatar" :size="props.ui?.leadingAvatarSize || ui.leadingAvatarSize()" v-bind="avatar" :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar })" />
    </slot>

    <slot :ui="ui">
      <span v-if="label !== void 0 && label !== null" :class="ui.label({ class: props.ui?.label })">
        {{ label }}
      </span>
    </slot>

    <slot name="trailing" :ui="ui">
      <UIcon v-if="isTrailing && trailingIconName" :name="trailingIconName" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
    </slot>
  </Primitive>
</template>
