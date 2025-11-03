<script>
import theme from "#build/ui/dashboard-toolbar";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { tv } from "../utils/tv";
const props = defineProps({
  as: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: null, required: false }
});
defineSlots();
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.dashboardToolbar || {} })());
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot>
      <div :class="ui.left({ class: [props.ui?.left] })">
        <slot name="left" />
      </div>

      <div :class="ui.right({ class: [props.ui?.right] })">
        <slot name="right" />
      </div>
    </slot>
  </Primitive>
</template>
