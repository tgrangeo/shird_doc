import { useRuntimeConfig } from "nuxt/app";
export function defineOgImage(_options = {}) {
  if (import.meta.dev) {
    console.warn("`defineOgImage()` is skipped as the OG Image module is not enabled.");
  }
}
export function defineOgImageComponent(component, props = {}, options = {}) {
  if (import.meta.dev) {
    console.warn("`defineOgImageComponent()` is skipped as the OG Image module is not enabled.");
  }
}
export function defineOgImageScreenshot(options = {}) {
  if (import.meta.dev) {
    if (useRuntimeConfig()["nuxt-og-image"]) {
      console.warn("`defineOgImageScreenshot()` is skipped as the `chromium` compatibility is disabled.");
    } else {
      console.warn("`defineOgImageScreenshot()` is skipped as the OG Image module is not enabled.");
    }
  }
}
