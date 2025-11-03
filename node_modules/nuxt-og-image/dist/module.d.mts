import * as _nuxt_schema from '@nuxt/schema';
import { AddComponentOptions } from '@nuxt/kit';
import { ResvgRenderOptions } from '@resvg/resvg-js';
import { SatoriOptions } from 'satori';
import { SharpOptions } from 'sharp';
import { OgImageOptions, InputFontConfig, CompatibilityFlagEnvOverrides, OgImageComponent } from '../dist/runtime/types.js';

interface ModuleOptions {
    /**
     * Whether the og:image images should be generated.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Default data used within the payload to generate the OG Image.
     *
     * You can use this to change the default template, image sizing and more.
     *
     * @default { component: 'NuxtSeo', width: 1200, height: 630, cache: true, cacheTtl: 24 * 60 * 60 * 1000 }
     */
    defaults: OgImageOptions;
    /**
     * Fonts to use when rendering the og:image.
     *
     * @example ['Roboto:400', 'Roboto:700', { path: 'path/to/font.ttf', weight: 400, name: 'MyFont' }]
     */
    fonts: InputFontConfig[];
    /**
     * Options to pass to satori.
     *
     * @see https://github.com/vercel/satori/blob/main/src/satori.ts#L18
     */
    satoriOptions?: Partial<SatoriOptions>;
    /**
     * Options to pass to resvg.
     *
     * @see https://github.com/yisibl/resvg-js/blob/main/wasm/index.d.ts#L39
     */
    resvgOptions?: Partial<ResvgRenderOptions>;
    /**
     * Options to pass to sharp.
     *
     * @see https://sharp.pixelplumbing.com/api-constructor
     */
    sharpOptions?: true | Partial<SharpOptions>;
    /**
     * Enables debug logs and a debug endpoint.
     *
     * @false false
     */
    debug: boolean;
    /**
     * Options to pass to the <OgImage> and <OgImageScreenshot> component.
     */
    componentOptions?: Pick<AddComponentOptions, 'global'>;
    /**
     * Modify the cache behavior.
     *
     * Passing a boolean will enable or disable the runtime cache with the default options.
     *
     * Providing a record will allow you to configure the runtime cache fully.
     *
     * @default true
     * @see https://nitro.unjs.io/guide/storage#mountpoints
     * @example { driver: 'redis', host: 'localhost', port: 6379, password: 'password' }
     */
    runtimeCacheStorage: boolean | (Record<string, any> & {
        driver: string;
    });
    /**
     * Extra component directories that should be used to resolve components.
     *
     * @default ['OgImage', 'og-image', 'OgImageTemplate']
     */
    componentDirs: string[];
    /**
     * Manually modify the compatibility.
     */
    compatibility?: CompatibilityFlagEnvOverrides;
    /**
     * Use an alternative host for downloading Google Fonts. This is used to support China where Google Fonts is blocked.
     *
     * When `true` is set will use `fonts.font.im`, otherwise will use a string as the host.
     */
    googleFontMirror?: true | string;
    /**
     * Only allow the prerendering and dev runtimes to generate images.
     */
    zeroRuntime?: boolean;
    /**
     * Enable when your nuxt/content files match your pages.
     *
     * This will automatically map the `ogImage` frontmatter key to the correct path.
     *
     * This is similar behavior to using `nuxt/content` with `documentDriven: true`.
     */
    strictNuxtContentPaths?: boolean;
}
interface ModuleHooks {
    'nuxt-og-image:components': (ctx: {
        components: OgImageComponent[];
    }) => Promise<void> | void;
    'nuxt-og-image:runtime-config': (config: ModuleOptions) => Promise<void> | void;
}
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions, ModuleOptions, false>;

export { _default as default };
export type { ModuleHooks, ModuleOptions };
