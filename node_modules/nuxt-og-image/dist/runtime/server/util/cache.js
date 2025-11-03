import { createError, getQuery, handleCacheHeaders, setHeader, setHeaders } from "h3";
import { useStorage } from "nitropack/runtime";
import { hash } from "ohash";
import { withTrailingSlash } from "ufo";
import { prefixStorage } from "unstorage";
export async function useOgImageBufferCache(ctx, options) {
  const maxAge = Number(options.cacheMaxAgeSeconds);
  let enabled = !import.meta.dev && import.meta.env?.MODE !== "test" && maxAge > 0;
  const cache = prefixStorage(useStorage(), withTrailingSlash(options.baseCacheKey || "/"));
  const key = ctx.key;
  let cachedItem = false;
  if (enabled) {
    const hasItem = await cache.hasItem(key).catch((e) => {
      enabled = false;
      return createError({
        cause: e,
        statusCode: 500,
        statusMessage: `[Nuxt OG Image] Failed to connect to cache ${options.baseCacheKey}. Response from cache: ${e.message}`
      });
    });
    if (hasItem instanceof Error)
      return hasItem;
    if (hasItem) {
      const { value, expiresAt, headers } = await cache.getItem(key).catch(() => ({
        value: null,
        expiresAt: Date.now()
      }));
      if (typeof getQuery(ctx.e).purge !== "undefined") {
        await cache.removeItem(key).catch(() => {
        });
      } else if (expiresAt > Date.now()) {
        cachedItem = Buffer.from(value, "base64");
        if (handleCacheHeaders(ctx.e, {
          modifiedTime: new Date(headers["last-modified"]),
          etag: headers.etag,
          maxAge
        })) {
          return;
        }
        setHeaders(ctx.e, headers);
      } else {
        await cache.removeItem(key).catch(() => {
        });
      }
    }
  }
  if (!enabled) {
    setHeader(ctx.e, "Cache-Control", "no-cache, no-store, must-revalidate");
    setHeader(ctx.e, "Pragma", "no-cache");
    setHeader(ctx.e, "Expires", "0");
  }
  return {
    enabled,
    cachedItem,
    async update(item) {
      if (!enabled)
        return;
      const value = Buffer.from(item).toString("base64");
      const headers = {
        // avoid multi-tenancy cache issues
        "Vary": "accept-encoding, host",
        "etag": `W/"${hash(value)}"`,
        "last-modified": (/* @__PURE__ */ new Date()).toUTCString(),
        "cache-control": `public, s-maxage=${maxAge}, stale-while-revalidate`
      };
      setHeaders(ctx.e, headers);
      await cache.setItem(key, {
        value,
        headers,
        expiresAt: Date.now() + maxAge * 1e3
      });
    }
  };
}
