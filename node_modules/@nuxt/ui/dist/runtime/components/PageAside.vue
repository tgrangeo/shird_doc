<script>
import theme from "#build/ui/page-aside";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { tv } from "../utils/tv";
const props = defineProps({
  as: { type: null, required: false, default: "aside" },
  class: { type: null, required: false },
  ui: { type: null, required: false }
});
const slots = defineSlots();
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pageAside || {} })());
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div :class="ui.container({ class: props.ui?.container })">
      <div v-if="!!slots.top" :class="ui.top({ class: props.ui?.top })">
        <div :class="ui.topHeader({ class: props.ui?.topHeader })" />
        <div :class="ui.topBody({ class: props.ui?.topBody })">
          <slot name="top" />
        </div>
        <div :class="ui.topFooter({ class: props.ui?.topFooter })" />
      </div>

      <slot />

      <slot name="bottom" />
    </div>
  </Primitive>
</template>
