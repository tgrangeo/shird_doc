import type { ResolvableMeta } from '@unhead/vue';
import type { InputFontConfig, OgImageOptions, OgImagePrebuilt, ResolvedFontConfig } from './types.js';
export declare function generateMeta(url: OgImagePrebuilt['url'] | string, resolvedOptions: OgImageOptions | OgImagePrebuilt): ResolvableMeta[];
export declare function toBase64Image(data: string | ArrayBuffer): string;
export declare function isInternalRoute(path: string): boolean;
export declare function separateProps(options: OgImageOptions | undefined, ignoreKeys?: string[]): {
    props: Record<string, any>;
};
export declare function normaliseFontInput(fonts: InputFontConfig[]): ResolvedFontConfig[];
export declare function withoutQuery(path: string): string | undefined;
export declare function getExtension(path: string): string;
/**
 * @deprecated Please use `#og-image/app/utils` instead.
 */
export declare function useOgImageRuntimeConfig(): {};
