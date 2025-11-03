import { defineNuxtPlugin } from "#app";
import { routeRuleOgImage as setup } from "../../utils/plugins.js";
export default defineNuxtPlugin({
  setup(nuxtApp) {
    if (import.meta.dev || import.meta.prerender) {
      setup(nuxtApp);
    }
  }
});
