import { defineNuxtPlugin } from "#app";
import { ogImageCanonicalUrls as setup } from "../../utils/plugins.js";
export default defineNuxtPlugin({
  setup(nuxtApp) {
    if (import.meta.dev || import.meta.prerender) {
      setup(nuxtApp);
    }
  }
});
