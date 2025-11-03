<script>
import theme from "#build/ui/page-cta";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { tv } from "../utils/tv";
import UButton from "./Button.vue";
import UContainer from "./Container.vue";
const props = defineProps({
  as: { type: null, required: false },
  class: { type: null, required: false },
  title: { type: String, required: false },
  description: { type: String, required: false },
  orientation: { type: null, required: false, default: "vertical" },
  reverse: { type: Boolean, required: false, default: false },
  variant: { type: null, required: false },
  links: { type: Array, required: false },
  ui: { type: null, required: false }
});
const slots = defineSlots();
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pageCTA || {} })({
  variant: props.variant,
  orientation: props.orientation,
  reverse: props.reverse,
  title: !!props.title || !!slots.title
}));
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot name="top" />

    <UContainer :class="ui.container({ class: props.ui?.container })">
      <div v-if="!!slots.header || (title || !!slots.title) || (description || !!slots.description) || !!slots.body || !!slots.footer || (links?.length || !!slots.links)" :class="ui.wrapper({ class: props.ui?.wrapper })">
        <div v-if="!!slots.header || (title || !!slots.title) || (description || !!slots.description)" :class="ui.header({ class: props.ui?.header })">
          <slot name="header">
            <h2 v-if="title || !!slots.title" :class="ui.title({ class: props.ui?.title })">
              <slot name="title">
                {{ title }}
              </slot>
            </h2>

            <div v-if="description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
              <slot name="description">
                {{ description }}
              </slot>
            </div>
          </slot>
        </div>

        <div v-if="!!slots.body" :class="ui.body({ class: props.ui?.body })">
          <slot name="body" />
        </div>

        <div v-if="!!slots.footer || (links?.length || !!slots.links)" :class="ui.footer({ class: props.ui?.footer })">
          <slot name="footer">
            <div v-if="links?.length || !!slots.links" :class="ui.links({ class: props.ui?.links })">
              <slot name="links">
                <UButton v-for="(link, index) in links" :key="index" size="lg" v-bind="link" />
              </slot>
            </div>
          </slot>
        </div>
      </div>

      <slot v-if="!!slots.default" />
      <div v-else-if="orientation === 'horizontal'" class="hidden lg:block" />
    </UContainer>

    <slot name="bottom" />
  </Primitive>
</template>
