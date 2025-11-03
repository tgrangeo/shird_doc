import { componentNames } from "#build/nuxt-og-image/components.mjs";
import { resolveUnrefHeadInput } from "@unhead/vue";
import { defu } from "defu";
import { stringify } from "devalue";
import { useHead, useRuntimeConfig } from "nuxt/app";
import { joinURL, withQuery } from "ufo";
import { generateMeta, separateProps } from "../shared.js";
export function setHeadOgImagePrebuilt(input) {
  if (import.meta.client) {
    return;
  }
  const url = input.url;
  if (!url)
    return;
  const meta = generateMeta(url, input);
  useHead({ meta }, { tagPriority: "high" });
}
export function createOgImageMeta(src, input, ssrContext) {
  if (import.meta.client) {
    return;
  }
  const { defaults } = useOgImageRuntimeConfig();
  const _input = separateProps(defu(input, ssrContext._ogImagePayload));
  if (input._query && Object.keys(input._query).length)
    src = withQuery(src, { _query: input._query });
  const meta = generateMeta(src, input);
  ssrContext._ogImageInstances = ssrContext._ogImageInstances || [];
  const script = [];
  if (src) {
    script.push({
      id: "nuxt-og-image-options",
      type: "application/json",
      processTemplateParams: true,
      innerHTML: () => {
        const payload = resolveUnrefHeadInput(_input);
        if (payload.props && typeof payload.props.title === "undefined")
          payload.props.title = "%s";
        payload.component = resolveComponentName(input.component, defaults.component || "");
        delete payload.url;
        if (payload._query && Object.keys(payload._query).length === 0) {
          delete payload._query;
        }
        const final = {};
        for (const k in payload) {
          if (payload[k] !== defaults[k]) {
            final[k] = payload[k];
          }
        }
        return stringify(final);
      },
      // we want this to be last in our head
      tagPosition: "bodyClose"
    });
  }
  const instance = useHead({
    script,
    meta
  }, {
    tagPriority: "high"
  });
  ssrContext._ogImagePayload = _input;
  ssrContext._ogImageInstances.push(instance);
}
export function resolveComponentName(component, fallback) {
  component = component || fallback || componentNames?.[0]?.pascalName;
  if (component && componentNames) {
    const originalName = component;
    for (const component2 of componentNames) {
      if (component2.pascalName.endsWith(originalName) || component2.kebabName.endsWith(originalName)) {
        return component2.pascalName;
      }
    }
  }
  return component;
}
export function getOgImagePath(pagePath, _options) {
  const baseURL = useRuntimeConfig().app.baseURL;
  const extension = _options?.extension || useOgImageRuntimeConfig().defaults?.extension || "png";
  const path = joinURL("/", baseURL, `__og-image__/${import.meta.prerender ? "static" : "image"}`, pagePath, `og.${extension}`);
  if (Object.keys(_options?._query || {}).length) {
    return withQuery(path, _options._query);
  }
  return path;
}
export function useOgImageRuntimeConfig() {
  const c = useRuntimeConfig();
  return {
    defaults: {},
    ...c["nuxt-og-image"],
    app: {
      baseURL: c.app.baseURL
    }
  };
}
