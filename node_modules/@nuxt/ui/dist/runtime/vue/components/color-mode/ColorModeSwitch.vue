<script>

</script>

<script setup>
import { computed } from "vue";
import { useAppConfig, useColorMode } from "#imports";
import { useLocale } from "../../../composables/useLocale";
import USwitch from "../../../components/Switch.vue";
defineOptions({ inheritAttrs: false });
defineProps({});
const { t } = useLocale();
const colorMode = useColorMode();
const appConfig = useAppConfig();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  }
});
</script>

<template>
  <USwitch
    v-model="isDark"
    :checked-icon="appConfig.ui.icons.dark"
    :unchecked-icon="appConfig.ui.icons.light"
    :aria-label="isDark ? t('colorMode.switchToLight') : t('colorMode.switchToDark')"
    v-bind="$attrs"
  />
</template>
