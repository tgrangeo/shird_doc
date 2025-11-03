import { createStorage } from "unstorage";
import lruCacheDriver from "unstorage/drivers/lru-cache";
export const htmlPayloadCache = createStorage({
  // short cache time so we don't need many entries at runtime
  driver: lruCacheDriver({ max: import.meta.prerender ? 1e4 : 50 })
});
export const prerenderOptionsCache = import.meta.prerender ? createStorage({
  driver: lruCacheDriver({ max: 1e4 })
}) : void 0;
export const fontCache = createStorage({
  driver: lruCacheDriver({ max: 10 })
});
export const emojiCache = createStorage({
  driver: lruCacheDriver({ max: 1e3 })
});
