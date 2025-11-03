import type { ModuleHooks } from './module.mjs'

declare module '@nuxt/schema' {
  interface NuxtHooks extends ModuleHooks {}
}

export { type JsonSchema } from './shared/nuxt-component-meta.KxfHq62s.mjs'

export { default } from './module.mjs'

export { type ComponentData, type ComponentMetaParserOptions, type ExtendHookData, type HookData, type ModuleHooks, type ModuleOptions, type NuxtComponentMeta, type TransformersHookData } from './module.mjs'
