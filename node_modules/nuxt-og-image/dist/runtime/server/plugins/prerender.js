import { prerenderOptionsCache } from "#og-image-cache";
import { createSitePathResolver } from "#site-config/server/composables/utils";
import { defineNitroPlugin } from "nitropack/runtime";
import { parseURL } from "ufo";
import { isInternalRoute } from "../../shared.js";
import { extractAndNormaliseOgImageOptions, resolvePathCacheKey } from "../og-image/context.js";
import { createNitroRouteRuleMatcher } from "../util/kit.js";
export default defineNitroPlugin(async (nitro) => {
  if (!import.meta.prerender)
    return;
  const routeRuleMatcher = createNitroRouteRuleMatcher();
  nitro.hooks.hook("render:html", async (html, ctx) => {
    const { head, bodyAppend } = html;
    const path = parseURL(ctx.event.path).pathname;
    if (isInternalRoute(path))
      return;
    const routeRules = routeRuleMatcher(path);
    if (routeRules.ogImage === false)
      return;
    const options = extractAndNormaliseOgImageOptions([
      head.join("\n"),
      bodyAppend.join("\n")
    ].join("\n"));
    if (!options)
      return;
    const resolvePathWithBase = createSitePathResolver(ctx.event, {
      absolute: false,
      withBase: true
    });
    const key = resolvePathCacheKey(ctx.event, resolvePathWithBase(path));
    await prerenderOptionsCache.setItem(key, options);
    const index = html.bodyAppend.findIndex((script) => script.includes('id="nuxt-og-image-options"'));
    if (index !== -1) {
      html.bodyAppend[index] = String(html.bodyAppend[index]).replace(/<script id="nuxt-og-image-options" type="application\/json">[\s\S]*?<\/script>/, "");
      html.bodyAppend[index] = html.bodyAppend[index].replace(/<script id="nuxt-og-image-overrides" type="application\/json">[\s\S]*?<\/script>/, "");
    }
  });
});
