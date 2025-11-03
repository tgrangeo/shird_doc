import type { H3Error, H3Event } from 'h3';
import type { OgImageOptions, OgImageRenderEventContext } from '../../types.js';
export declare function resolvePathCacheKey(e: H3Event, path: string): string;
export declare function resolveContext(e: H3Event): Promise<H3Error | OgImageRenderEventContext>;
export declare function extractAndNormaliseOgImageOptions(html: string): OgImageOptions | false;
