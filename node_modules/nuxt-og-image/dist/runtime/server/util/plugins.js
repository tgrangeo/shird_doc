import { defu } from "defu";
import { stringify } from "devalue";
import { withQuery } from "ufo";
import { generateMeta } from "../../shared.js";
import { getOgImagePath, useOgImageRuntimeConfig } from "../utils.js";
import { normaliseOptions } from "./options.js";
export function nuxtContentPlugin(nitroApp) {
  const { isNuxtContentDocumentDriven, strictNuxtContentPaths, defaults } = useOgImageRuntimeConfig();
  nitroApp.hooks.hook("content:file:afterParse", async (content) => {
    if (content._draft || content._extension !== "md" || content._partial || content.indexable === false || content.index === false)
      return;
    let path = content.path;
    if (isNuxtContentDocumentDriven && !path)
      path = content._path;
    let shouldRenderOgImage = !!content.ogImage;
    if (typeof content.ogImage === "undefined" && (strictNuxtContentPaths || typeof content.path !== "undefined")) {
      shouldRenderOgImage = true;
    }
    if (path && shouldRenderOgImage) {
      const ogImageConfig = (typeof content.ogImage === "object" ? content.ogImage : {}) || {};
      const optionsWithDefault = defu(ogImageConfig, defaults);
      let src = optionsWithDefault.url || getOgImagePath(path, optionsWithDefault);
      if (optionsWithDefault._query && Object.keys(optionsWithDefault._query).length)
        src = withQuery(src, { _query: optionsWithDefault._query });
      const meta = generateMeta(src, ogImageConfig);
      if (optionsWithDefault.url) {
        content.head = defu({ meta }, content.head);
        return content;
      }
      const payload = {
        title: content.title,
        excerpt: content.description || content.excerpt,
        ...content.ogImage
      };
      Object.entries(ogImageConfig).forEach(([key, val]) => {
        payload[key.replace(/-([a-z])/g, (g) => String(g[1]).toUpperCase())] = val;
      });
      content.head = defu({
        script: [
          {
            id: "nuxt-og-image-overrides",
            type: "application/json",
            processTemplateParams: true,
            innerHTML: stringify(normaliseOptions(payload)),
            // we want this to be last in our head
            tagPosition: "bodyClose",
            tagPriority: 30
            // slighty higher priority
          }
        ],
        meta: generateMeta(src, optionsWithDefault)
      }, content.head);
    }
    return content;
  });
}
