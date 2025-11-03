import type { OgImageRenderEventContext, ResolvedFontConfig } from '../../../types.js';
export declare const assets: import("unstorage").Storage<any>;
export declare function loadFont({ e, publicStoragePath }: OgImageRenderEventContext, font: ResolvedFontConfig): Promise<ResolvedFontConfig>;
