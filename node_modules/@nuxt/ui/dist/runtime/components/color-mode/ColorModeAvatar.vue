<script>

</script>

<script setup>
import UAvatar from "../Avatar.vue";
defineOptions({ inheritAttrs: false });
defineProps({
  light: { type: String, required: true },
  dark: { type: String, required: true }
});
</script>

<template>
  <UAvatar :src="light" class="dark:hidden" v-bind="$attrs" />
  <UAvatar :src="dark" class="hidden dark:block" v-bind="$attrs" />
</template>
