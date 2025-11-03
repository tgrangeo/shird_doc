import type { NuxtSSRContext } from 'nuxt/app';
import type { OgImageOptions, OgImagePrebuilt, OgImageRuntimeConfig } from '../types.js';
export declare function setHeadOgImagePrebuilt(input: OgImagePrebuilt): void;
export declare function createOgImageMeta(src: string, input: OgImageOptions | OgImagePrebuilt, ssrContext: NuxtSSRContext): void;
export declare function resolveComponentName(component: OgImageOptions['component'], fallback: string): OgImageOptions['component'];
export declare function getOgImagePath(pagePath: string, _options?: Partial<OgImageOptions>): string;
export declare function useOgImageRuntimeConfig(): OgImageRuntimeConfig;
