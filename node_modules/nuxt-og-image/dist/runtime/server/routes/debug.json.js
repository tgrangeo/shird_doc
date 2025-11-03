import { componentNames } from "#og-image-virtual/component-names.mjs";
import compatibility from "#og-image/compatibility";
import { useSiteConfig } from "#site-config/server/composables/useSiteConfig";
import { defineEventHandler, setHeader } from "h3";
import { useOgImageRuntimeConfig } from "../utils.js";
export default defineEventHandler(async (e) => {
  setHeader(e, "Content-Type", "application/json");
  const runtimeConfig = useOgImageRuntimeConfig();
  return {
    siteConfigUrl: useSiteConfig(e).url,
    componentNames,
    runtimeConfig,
    compatibility
  };
});
