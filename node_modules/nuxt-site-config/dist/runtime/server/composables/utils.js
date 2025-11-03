import { useRuntimeConfig } from "nitropack/runtime";
import { fixSlashes, resolveSitePath } from "site-config-stack/urls";
import { getNitroOrigin } from "./getNitroOrigin.js";
import { getSiteConfig } from "./getSiteConfig.js";
export function createSitePathResolver(e, options = {}) {
  const siteConfig = getSiteConfig(e);
  const nitroOrigin = getNitroOrigin(e);
  const nuxtBase = useRuntimeConfig(e).app.baseURL || "/";
  return (path) => {
    return resolveSitePath(path, {
      ...options,
      siteUrl: options.canonical !== false || import.meta.prerender ? siteConfig.url : nitroOrigin,
      trailingSlash: siteConfig.trailingSlash,
      base: nuxtBase
    });
  };
}
export function withSiteTrailingSlash(e, path) {
  const siteConfig = e.context.siteConfig?.get();
  return fixSlashes(siteConfig.trailingSlash, path);
}
export function withSiteUrl(e, path, options = {}) {
  const siteConfig = e.context.siteConfig?.get();
  let siteUrl = e.context.siteConfigNitroOrigin;
  if ((options.canonical !== false || import.meta.prerender) && siteConfig.url)
    siteUrl = siteConfig.url;
  return resolveSitePath(path, {
    absolute: true,
    siteUrl,
    trailingSlash: siteConfig.trailingSlash,
    base: e.context.nitro.baseURL,
    withBase: options.withBase
  });
}
