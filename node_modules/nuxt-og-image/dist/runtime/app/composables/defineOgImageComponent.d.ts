import type { OgImageComponents } from '#og-image/components';
import type { ExtractComponentProps, OgImageOptions } from '../../types.js';
export declare function defineOgImageComponent<T extends keyof OgImageComponents>(component: T, props?: Partial<ExtractComponentProps<OgImageComponents[T]>>, options?: OgImageOptions): void;
