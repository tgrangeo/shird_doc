import type { OgImageComponents } from '#og-image/components';
import type { DefineOgImageInput, ExtractComponentProps, OgImageOptions, OgImagePageScreenshotOptions } from '../../types.js';
export declare function defineOgImage(_options?: DefineOgImageInput): void;
export declare function defineOgImageComponent<T extends keyof OgImageComponents>(component: T, props?: Partial<ExtractComponentProps<OgImageComponents[T]>>, options?: OgImageOptions): void;
export declare function defineOgImageScreenshot(options?: OgImagePageScreenshotOptions): void;
