import { useRuntimeConfig } from "nitropack/runtime";
import { joinURL, withQuery } from "ufo";
export function getOgImagePath(pagePath, _options) {
  const baseURL = useRuntimeConfig().app.baseURL;
  const extension = _options?.extension || useOgImageRuntimeConfig().defaults.extension;
  const path = joinURL("/", baseURL, `__og-image__/${import.meta.prerender ? "static" : "image"}`, pagePath, `og.${extension}`);
  if (Object.keys(_options?._query || {}).length) {
    return withQuery(path, _options._query);
  }
  return path;
}
export function useOgImageRuntimeConfig(e) {
  const c = useRuntimeConfig(e);
  return {
    ...c["nuxt-og-image"],
    app: {
      baseURL: c.app.baseURL
    }
  };
}
