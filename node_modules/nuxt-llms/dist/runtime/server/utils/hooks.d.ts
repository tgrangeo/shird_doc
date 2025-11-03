import type { H3Event } from 'h3';
import type { NitroRuntimeHooks } from 'nitropack/types';
import type { ModuleOptions } from 'nuxt-llms';
/**
 * @deprecated Custom hooks are deprecated in favor of NitroRuntimeHooks.
 */
export interface LLMSHooks {
    'generate': (event: H3Event, options: ModuleOptions) => void;
    'generate:full': (event: H3Event, options: ModuleOptions, contents: string[]) => void;
}
/**
 * @deprecated Custom hooks are deprecated in favor of NitroRuntimeHooks.
 */
export declare const llmsHooks: import("hookable").Hookable<LLMSHooks, import("hookable").HookKeys<LLMSHooks>>;
/**
 * Run a callback when LLMs is being generated.
 *
 * @deprecated Use `useNitroApp().hooks.hook('llms:generate', (event, options) => {})` instead
 */
export declare function onLLMsGenerate(cb: NitroRuntimeHooks['llms:generate']): any;
/**
 * Run a callback when Full LLMs is being generated.
 *
 * @deprecated Use `useNitroApp().hooks.hook('llms:generate:full', (event, options, contents) => {})` instead
 */
export declare function onLLMsGenerateFull(cb: NitroRuntimeHooks['llms:generate:full']): any;
