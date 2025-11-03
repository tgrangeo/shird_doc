import type { Storage } from 'unstorage';
import type { OgImageOptions } from '../../../types.js';
export declare const htmlPayloadCache: Storage<{
    expiresAt: number;
    value: OgImageOptions;
}>;
export declare const prerenderOptionsCache: Storage<OgImageOptions> | undefined;
export declare const fontCache: Storage<BufferSource>;
export declare const emojiCache: Storage<string>;
