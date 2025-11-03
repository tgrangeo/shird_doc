import type { OgImageOptions, OgImageRuntimeConfig } from '#og-image/types';
import type { H3Event } from 'h3';
export declare function getOgImagePath(pagePath: string, _options?: Partial<OgImageOptions>): string;
export declare function useOgImageRuntimeConfig(e?: H3Event): OgImageRuntimeConfig;
