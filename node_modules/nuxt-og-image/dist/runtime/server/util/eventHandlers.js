import { createError, getQuery, H3Error, proxyRequest, sendRedirect, setHeader, setResponseHeader } from "h3";
import { parseURL } from "ufo";
import { normaliseFontInput } from "../../shared.js";
import { resolveContext } from "../og-image/context.js";
import { assets } from "../og-image/satori/font.js";
import { html } from "../og-image/templates/html.js";
import { useOgImageRuntimeConfig } from "../utils.js";
import { useOgImageBufferCache } from "./cache.js";
export async function fontEventHandler(e) {
  const path = parseURL(e.path).pathname;
  const { fonts } = useOgImageRuntimeConfig();
  const key = path.split("/font/")[1];
  if (key && key.includes(":")) {
    const font2 = fonts.find((f) => f.key === key);
    if (font2?.key && await assets.hasItem(font2.key)) {
      let fontData = await assets.getItem(font2.key);
      if (fontData instanceof Uint8Array) {
        const decoder = new TextDecoder();
        fontData = decoder.decode(fontData);
      }
      if (key.includes(".oft")) {
        setResponseHeader(e, "Content-Type", "font/otf");
      } else if (key.includes(".woff2")) {
        setResponseHeader(e, "Content-Type", "font/woff2");
      } else if (key.includes(".ttf")) {
        setResponseHeader(e, "Content-Type", "font/ttf");
      }
      return Buffer.from(fontData, "base64");
    }
  }
  const [_name, _weight] = String(key?.split(".")[0]).split("/");
  if (!_name || !_weight)
    return "Provide a font name and weight";
  const name = String(_name[0]).toUpperCase() + _name.slice(1);
  const weight = Math.round(Number.parseInt(_weight) / 100) * 100;
  const config = useOgImageRuntimeConfig();
  const normalisedFonts = normaliseFontInput(config.fonts);
  let font;
  if (typeof getQuery(e).font === "string")
    font = JSON.parse(getQuery(e).font);
  if (!font) {
    font = normalisedFonts.find((font2) => {
      return font2.name.toLowerCase() === name.toLowerCase() && weight === Number(font2.weight);
    });
  }
  if (!font) {
    return createError({
      statusCode: 404,
      statusMessage: `[Nuxt OG Image] Font ${name}:${weight} not found`
    });
  }
  const css = await globalThis.$fetch(`https://fonts.googleapis.com/css2?family=${name}:wght@${weight}`, {
    headers: {
      // Make sure it returns TTF.
      "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1"
    }
  });
  if (!css) {
    return createError({
      statusCode: 500,
      statusMessage: `[Nuxt OG Image] Invalid Google Font ${name}:${weight}`
    });
  }
  const ttfResource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);
  if (ttfResource?.[1])
    return proxyRequest(e, ttfResource[1], {});
  const woff2Resource = css.match(/src: url\((.+)\) format\('woff2'\)/);
  if (woff2Resource?.[1])
    return sendRedirect(e, woff2Resource[1]);
  return createError({
    statusCode: 500,
    statusMessage: `[Nuxt OG Image] Malformed Google Font CSS ${css}`
  });
}
export async function imageEventHandler(e) {
  const ctx = await resolveContext(e);
  if (ctx instanceof H3Error)
    return ctx;
  const { isDebugJsonPayload, extension, options, renderer } = ctx;
  const { debug, baseCacheKey } = useOgImageRuntimeConfig();
  const compatibilityHints = [];
  if (isDebugJsonPayload) {
    const queryExtension = getQuery(e).extension || ctx.options.extension;
    if (["jpeg", "jpg"].includes(queryExtension) && options.renderer === "satori")
      compatibilityHints.push("Converting PNGs to JPEGs requires Sharp which only runs on Node based systems.");
    if (options.renderer === "chromium")
      compatibilityHints.push("Using Chromium to generate images is only supported in Node based environments. It's recommended to only use this if you're prerendering");
    setHeader(e, "Content-Type", "application/json");
    return {
      siteConfig: {
        url: e.context.siteConfig.get().url
      },
      compatibilityHints,
      cacheKey: ctx.key,
      options: ctx.options,
      ...options.renderer === "satori" ? await renderer.debug(ctx) : void 0
    };
  }
  switch (extension) {
    case "html":
      setHeader(e, "Content-Type", `text/html`);
      return html(ctx);
    case "svg":
      if (!debug && !import.meta.dev) {
        return createError({
          statusCode: 404
        });
      }
      if (ctx.renderer.name !== "satori") {
        return createError({
          statusCode: 400,
          statusMessage: `[Nuxt OG Image] Generating ${extension}'s with ${renderer.name} is not supported.`
        });
      }
      setHeader(e, "Content-Type", `image/svg+xml`);
      return (await ctx.renderer.debug(ctx)).svg;
    case "png":
    case "jpeg":
    case "jpg":
      if (!renderer.supportedFormats.includes(extension)) {
        return createError({
          statusCode: 400,
          statusMessage: `[Nuxt OG Image] Generating ${extension}'s with ${renderer.name} is not supported.`
        });
      }
      setHeader(e, "Content-Type", `image/${extension === "jpg" ? "jpeg" : extension}`);
      break;
    default:
      return createError({
        statusCode: 400,
        statusMessage: `[Nuxt OG Image] Invalid request for og.${extension}.`
      });
  }
  const cacheApi = await useOgImageBufferCache(ctx, {
    cacheMaxAgeSeconds: ctx.options.cacheMaxAgeSeconds,
    baseCacheKey
  });
  if (typeof cacheApi === "undefined")
    return;
  if (cacheApi instanceof H3Error)
    return cacheApi;
  let image = cacheApi.cachedItem;
  if (!image) {
    image = await renderer.createImage(ctx);
    if (image instanceof H3Error)
      return image;
    if (!image) {
      return createError({
        statusCode: 500,
        statusMessage: `Failed to generate og.${extension}.`
      });
    }
    await cacheApi.update(image);
  }
  return image;
}
