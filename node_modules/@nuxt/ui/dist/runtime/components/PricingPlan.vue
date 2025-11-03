<script>
import theme from "#build/ui/pricing-plan";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { tv } from "../utils/tv";
import UBadge from "./Badge.vue";
import UButton from "./Button.vue";
import UIcon from "./Icon.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  title: { type: String, required: false },
  description: { type: String, required: false },
  badge: { type: [String, Object], required: false },
  billingCycle: { type: String, required: false },
  billingPeriod: { type: String, required: false },
  price: { type: String, required: false },
  discount: { type: String, required: false },
  features: { type: Array, required: false },
  button: { type: Object, required: false },
  tagline: { type: String, required: false },
  terms: { type: String, required: false },
  orientation: { type: null, required: false, default: "vertical" },
  variant: { type: null, required: false },
  highlight: { type: Boolean, required: false },
  scale: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: null, required: false }
});
const slots = defineSlots();
const appConfig = useAppConfig();
const [DefinePriceTemplate, ReusePriceTemplate] = createReusableTemplate();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pricingPlan || {} })({
  orientation: props.orientation,
  variant: props.variant,
  highlight: props.highlight,
  scale: props.scale
}));
const features = computed(() => props.features?.map((feature) => typeof feature === "string" ? { title: feature } : feature));
</script>

<template>
  <DefinePriceTemplate>
    <div v-if="discount || price || !!slots.discount || !!slots.price || billingCycle || billingPeriod || !!slots.billing" :class="ui.priceWrapper({ class: props.ui?.priceWrapper })">
      <div v-if="discount && price || !!slots.discount" :class="ui.discount({ class: props.ui?.discount })">
        <slot name="discount">
          {{ price }}
        </slot>
      </div>

      <div v-if="discount || price || !!slots.price" :class="ui.price({ class: props.ui?.price })">
        <slot name="price">
          {{ discount || price }}
        </slot>
      </div>

      <div v-if="billingCycle || billingPeriod || !!slots.billing" :class="ui.billing({ class: props.ui?.billing })">
        <slot name="billing" :ui="ui">
          <span :class="ui.billingPeriod({ class: props.ui?.billingPeriod })">
            {{ billingPeriod || "\xA0" }}
          </span>

          <span v-if="billingCycle" :class="ui.billingCycle({ class: props.ui?.billingCycle })">
            {{ billingCycle }}
          </span>
        </slot>
      </div>
    </div>
  </DefinePriceTemplate>

  <Primitive :as="as" v-bind="$attrs" :data-orientation="orientation" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="!!slots.header && orientation === 'vertical'" :class="ui.header({ class: props.ui?.header })">
      <slot name="header" />
    </div>

    <div :class="ui.body({ class: props.ui?.body })">
      <slot name="body">
        <div :class="ui.titleWrapper({ class: props.ui?.titleWrapper })">
          <div v-if="title || !!slots.title" :class="ui.title({ class: props.ui?.title })">
            <slot name="title">
              {{ title }}
            </slot>
          </div>

          <slot name="badge" :ui="ui">
            <UBadge v-if="badge" color="primary" variant="subtle" v-bind="typeof badge === 'string' ? { label: badge } : badge" :class="ui.badge({ class: props.ui?.badge })" />
          </slot>
        </div>

        <div v-if="description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
          <slot name="description">
            {{ description }}
          </slot>
        </div>

        <ReusePriceTemplate v-if="orientation === 'vertical'" />

        <ul v-if="features?.length || !!slots.features" :class="ui.features({ class: props.ui?.features })">
          <slot name="features">
            <li v-for="(feature, index) in features" :key="index" :class="ui.feature({ class: props.ui?.feature })">
              <UIcon :name="feature.icon || appConfig.ui.icons.success" :class="ui.featureIcon({ class: props.ui?.featureIcon })" />

              <span :class="ui.featureTitle({ class: props.ui?.featureTitle })">{{ feature.title }}</span>
            </li>
          </slot>
        </ul>
      </slot>
    </div>

    <div v-if="terms || !!slots.terms || (button || !!slots.button) || orientation === 'horizontal' || (tagline || !!slots.tagline) || !!slots.footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer">
        <div v-if="tagline || !!slots.tagline" :class="ui.tagline({ class: props.ui?.tagline })">
          <slot name="tagline">
            {{ tagline }}
          </slot>
        </div>

        <ReusePriceTemplate v-if="orientation === 'horizontal'" />

        <slot name="button" :ui="ui">
          <UButton v-if="button" v-bind="{ block: true, size: 'lg', ...button }" :class="ui.button({ class: props.ui?.button })" @click="button?.onClick" />
        </slot>

        <div v-if="terms || !!slots.terms" :class="ui.terms({ class: props.ui?.terms })">
          <slot name="terms">
            {{ terms }}
          </slot>
        </div>
      </slot>
    </div>
  </Primitive>
</template>
