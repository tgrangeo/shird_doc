import { useNitroOrigin } from "#site-config/server/composables/useNitroOrigin";
import { createConsola } from "consola";
import { useCssInline } from "../instances.js";
export async function applyInlineCss(ctx, island) {
  const { e } = ctx;
  let html = island.html;
  let css = island.head.style?.map((s) => s.innerHTML).filter(Boolean).join("\n") || "";
  const componentInlineStyles = island.head.link?.filter((l) => l.href.startsWith("/_nuxt/components") && l.href.replaceAll("/", "").includes(ctx.options.component)) || [];
  if (!import.meta.prerender && !componentInlineStyles.length) {
    return false;
  }
  let linksToCss = [];
  if (import.meta.dev) {
    const cssResults = componentInlineStyles.length ? await Promise.all(
      componentInlineStyles.map((l) => {
        const url = l.href.endsWith("lang.css") ? `${l.href}&hmr=false` : l.href;
        return e.$fetch(url, {
          responseType: "text",
          baseURL: useNitroOrigin(e)
        }).then((res) => {
          if (res.includes("__vite__css"))
            return res.match(/__vite__css = "([^"]+)"/)?.[1] || "";
          return res.trim().split("\n").filter((l2) => !l2.startsWith("//")).join("\n").trim();
        }).catch(() => {
          return "";
        });
      })
    ) : [];
    linksToCss = cssResults;
    css = [linksToCss.join("\n"), css].join("\n");
  }
  if (!css.trim().length)
    return false;
  const cssInline = await useCssInline();
  if (!cssInline || cssInline?.__mock__) {
    if (componentInlineStyles.length) {
      const logger = createConsola().withTag("Nuxt OG Image");
      logger.warn("To have inline styles applied you need to install either the `@css-inline/css-inline` or `@css-inline/css-inline-wasm` package.");
    }
    return false;
  }
  html = cssInline.inline(island.html, {
    loadRemoteStylesheets: false,
    extraCss: css
  });
  const classes = css.match(/\.([\w-]+)/g)?.map((c) => c.replace(".", ""));
  if (classes)
    html = html.replace(new RegExp(`class="(${classes.join("|")})"`, "g"), "");
  island.html = html;
  return true;
}
