<script>
import theme from "#build/ui/chat-prompt";
</script>

<script setup>
import { computed, useTemplateRef } from "vue";
import { Primitive, useForwardProps } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useLocale } from "../composables/useLocale";
import { omit, transformUI } from "../utils";
import { tv } from "../utils/tv";
import UTextarea from "./Textarea.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false, default: "form" },
  placeholder: { type: String, required: false },
  autofocus: { type: Boolean, required: false, default: true },
  autoresize: { type: Boolean, required: false, default: true },
  rows: { type: Number, required: false, default: 1 },
  variant: { type: null, required: false },
  error: { type: Error, required: false },
  class: { type: null, required: false },
  ui: { type: void 0, required: false }
});
const emits = defineEmits(["submit", "close"]);
const slots = defineSlots();
const model = defineModel({ type: String, ...{ default: "" } });
const { t } = useLocale();
const appConfig = useAppConfig();
const textareaProps = useForwardProps(reactivePick(props, "autofocus", "autoresize", "rows"));
const getProxySlots = () => omit(slots, ["header", "footer"]);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.chatPrompt || {} })({
  variant: props.variant
}));
function submit(e) {
  if (model.value.trim() === "") {
    return;
  }
  emits("submit", e);
}
function blur(e) {
  textarea.value?.textareaRef?.blur();
  emits("close", e);
}
const textarea = useTemplateRef("textarea");
defineExpose({
  textareaRef: textarea.value?.textareaRef
});
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })" @submit.prevent="submit">
    <div v-if="!!slots.header" :class="ui.header({ class: props.ui?.header })">
      <slot name="header" />
    </div>

    <UTextarea
      ref="textarea"
      v-model="model"
      :placeholder="placeholder || t('chatPrompt.placeholder')"
      :disabled="Boolean(error)"
      variant="none"
      v-bind="{ ...textareaProps, ...$attrs }"
      :ui="transformUI(omit(ui, ['root', 'body', 'header', 'footer']), props.ui)"
      :class="ui.body({ class: props.ui?.body })"
      @keydown.enter.exact.prevent="submit"
      @keydown.esc="blur"
    >
      <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </UTextarea>

    <div v-if="!!slots.footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
