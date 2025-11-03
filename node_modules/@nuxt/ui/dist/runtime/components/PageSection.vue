<script>
import theme from "#build/ui/page-section";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { tv } from "../utils/tv";
import UPageFeature from "./PageFeature.vue";
import UContainer from "./Container.vue";
import UIcon from "./Icon.vue";
import UButton from "./Button.vue";
const props = defineProps({
  as: { type: null, required: false, default: "section" },
  headline: { type: String, required: false },
  icon: { type: [String, Object], required: false },
  title: { type: String, required: false },
  description: { type: String, required: false },
  links: { type: Array, required: false },
  features: { type: Array, required: false },
  orientation: { type: null, required: false, default: "vertical" },
  reverse: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: null, required: false }
});
const slots = defineSlots();
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pageSection || {} })({
  orientation: props.orientation,
  reverse: props.reverse,
  title: !!props.title || !!slots.title,
  description: !!props.description || !!slots.description,
  body: !!slots.body || (!!props.features?.length || !!slots.features)
}));
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot name="top" />

    <UContainer :class="ui.container({ class: props.ui?.container })">
      <div v-if="!!slots.header || (icon || !!slots.leading) || (headline || !!slots.headline) || (title || !!slots.title) || (description || !!slots.description) || !!slots.body || (features?.length || !!slots.features) || !!slots.footer || (links?.length || !!slots.links)" :class="ui.wrapper({ class: props.ui?.wrapper })">
        <div v-if="!!slots.header || (icon || !!slots.leading) || (headline || !!slots.headline) || (title || !!slots.title) || (description || !!slots.description)" :class="ui.header({ class: props.ui?.header })">
          <slot name="header">
            <div v-if="icon || !!slots.leading" :class="ui.leading({ class: props.ui?.leading })">
              <slot name="leading" :ui="ui">
                <UIcon v-if="icon" :name="icon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
              </slot>
            </div>

            <div v-if="headline || !!slots.headline" :class="ui.headline({ class: props.ui?.headline, headline: !slots.headline })">
              <slot name="headline">
                {{ headline }}
              </slot>
            </div>

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

        <div v-if="!!slots.body || (features?.length || !!slots.features)" :class="ui.body({ class: props.ui?.body })">
          <slot name="body">
            <ul v-if="features?.length || !!slots.features" :class="ui.features({ class: props.ui?.features })">
              <slot name="features">
                <UPageFeature
                  v-for="(feature, index) in features"
                  :key="index"
                  as="li"
                  v-bind="feature"
                />
              </slot>
            </ul>
          </slot>
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
