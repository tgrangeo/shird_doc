import { useRequestEvent } from "#app";
import { withSiteUrl } from "#site-config/app/composables";
import { TemplateParamsPlugin } from "@unhead/vue/plugins";
import { defu } from "defu";
import { parse, stringify } from "devalue";
import { createRouter as createRadixRouter, toRouteMatcher } from "radix3";
import { parseURL, withoutBase } from "ufo";
import { toValue } from "vue";
import { createOgImageMeta } from "../../app/utils.js";
import { isInternalRoute, separateProps } from "../../shared.js";
import { getOgImagePath } from "../utils.js";
export function ogImageCanonicalUrls(nuxtApp) {
  nuxtApp.hooks.hook("app:rendered", async (ctx) => {
    const { ssrContext } = ctx;
    const e = useRequestEvent();
    const path = parseURL(e?.path || "").pathname;
    if (isInternalRoute(path))
      return;
    ssrContext?.head.use(TemplateParamsPlugin);
    ssrContext?.head.use({
      key: "nuxt-og-image:overrides-and-canonical-urls",
      hooks: {
        "tags:resolve": async (ctx2) => {
          const hasPrimaryPayload = ctx2.tags.some((tag) => tag.tag === "script" && tag.props.id === "nuxt-og-image-options");
          let overrides;
          for (const tag of ctx2.tags) {
            if (tag.tag === "script" && tag.props.id === "nuxt-og-image-overrides") {
              if (hasPrimaryPayload) {
                overrides = separateProps(parse(tag.innerHTML || "{}"));
                delete ctx2.tags[ctx2.tags.indexOf(tag)];
              } else {
                tag.props.id = "nuxt-og-image-options";
                tag.innerHTML = stringify(separateProps(parse(tag.innerHTML || "{}")));
                tag._d = "script:id:nuxt-og-image-options";
              }
              break;
            }
          }
          ctx2.tags = ctx2.tags.filter(Boolean);
          for (const tag of ctx2.tags) {
            if (tag.tag === "meta" && (tag.props.property === "og:image" || ["twitter:image:src", "twitter:image"].includes(tag.props.name || ""))) {
              if (!tag.props.content) {
                tag.props = {};
                continue;
              }
              if (!tag.props.content?.startsWith("https")) {
                await nuxtApp.runWithContext(() => {
                  tag.props.content = toValue(withSiteUrl(tag.props.content || "", {
                    withBase: true
                  }));
                });
              }
            } else if (overrides && tag.tag === "script" && tag.props.id === "nuxt-og-image-options") {
              tag.innerHTML = stringify(defu(overrides, parse(tag.innerHTML || "{}")));
            }
          }
        }
      }
    });
  });
}
export function routeRuleOgImage(nuxtApp) {
  nuxtApp.hooks.hook("app:rendered", async (ctx) => {
    const { ssrContext } = ctx;
    const e = useRequestEvent();
    const path = parseURL(e?.path || "").pathname;
    if (isInternalRoute(path))
      return;
    const _routeRulesMatcher = toRouteMatcher(
      createRadixRouter({ routes: ssrContext?.runtimeConfig?.nitro?.routeRules })
    );
    const matchedRules = _routeRulesMatcher.matchAll(
      withoutBase(path.split("?")?.[0] || "", ssrContext?.runtimeConfig?.app.baseURL || "")
    ).reverse();
    const combinedRules = defu({}, ...matchedRules);
    let routeRules = combinedRules?.ogImage;
    if (typeof routeRules === "undefined")
      return;
    const ogImageInstances = nuxtApp.ssrContext._ogImageInstances || [];
    if (routeRules === false) {
      ogImageInstances?.forEach((e2) => {
        e2.dispose();
      });
      nuxtApp.ssrContext._ogImagePayload = void 0;
      nuxtApp.ssrContext._ogImageInstances = void 0;
      return;
    }
    routeRules = defu(nuxtApp.ssrContext?.event?.context._nitro?.routeRules?.ogImage, routeRules);
    const src = getOgImagePath(ssrContext.url, routeRules);
    createOgImageMeta(src, routeRules, nuxtApp.ssrContext);
  });
}
