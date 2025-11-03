import { eventHandler, setHeader } from "h3";
import { useRuntimeConfig } from "nitropack/runtime";
import { getNitroOrigin } from "../../composables/getNitroOrigin.js";
import { getSiteConfig } from "../../composables/getSiteConfig.js";
export default eventHandler(async (e) => {
  const siteConfig = getSiteConfig(e);
  const nitroOrigin = getNitroOrigin(e);
  const runtimeConfig = useRuntimeConfig(e);
  const stack = e.context.siteConfig.stack;
  setHeader(e, "Content-Type", "application/json");
  return {
    config: siteConfig,
    stack,
    nitroOrigin,
    version: runtimeConfig["nuxt-site-config"].version
  };
});
