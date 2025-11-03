import type { H3Error } from 'h3';
import type { OgImageRenderEventContext } from '../../types.js';
export declare function useOgImageBufferCache(ctx: OgImageRenderEventContext, options: {
    baseCacheKey: string | false;
    cacheMaxAgeSeconds?: number;
}): Promise<void | H3Error | {
    cachedItem: false | BufferSource;
    enabled: boolean;
    update: (image: BufferSource | Buffer | Uint8Array) => Promise<void>;
}>;
