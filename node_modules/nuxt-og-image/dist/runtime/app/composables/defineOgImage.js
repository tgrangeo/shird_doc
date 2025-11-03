import { appendHeader } from "h3";
import { createError, useNuxtApp, useRequestEvent, useRoute, useState } from "nuxt/app";
import { ref, toValue } from "vue";
import { createOgImageMeta, getOgImagePath, setHeadOgImagePrebuilt, useOgImageRuntimeConfig } from "../utils.js";
export function defineOgImage(_options = {}) {
  const nuxtApp = useNuxtApp();
  const route = useRoute();
  const basePath = route.path || "/";
  if (nuxtApp.payload.path === basePath) {
    const state = import.meta.dev ? useState(`og-image:ssr-exists:${basePath}`, () => false) : ref(false);
    if (import.meta.dev && !import.meta.server) {
      if (!state.value) {
        throw createError({ message: "You are using a defineOgImage() function in a client-only context. You must call this function within your root component setup, see https://github.com/nuxt-modules/og-image/pull/293." });
      }
      return;
    }
    state.value = true;
  }
  if (!import.meta.server) {
    return;
  }
  const { defaults } = useOgImageRuntimeConfig();
  const options = toValue(_options);
  if (options === false) {
    return;
  }
  const validOptions = options;
  for (const key in defaults) {
    if (validOptions[key] === void 0)
      validOptions[key] = defaults[key];
  }
  if (route.query)
    validOptions._query = route.query;
  if (validOptions.url) {
    setHeadOgImagePrebuilt(validOptions);
    return;
  }
  const path = getOgImagePath(basePath, validOptions);
  if (import.meta.prerender) {
    appendHeader(useRequestEvent(nuxtApp), "x-nitro-prerender", path);
  }
  createOgImageMeta(path, validOptions, nuxtApp.ssrContext);
}
