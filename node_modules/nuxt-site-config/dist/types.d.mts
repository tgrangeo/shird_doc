import type { ModuleHooks, ModuleRuntimeConfig } from './module.mjs'

declare module '@nuxt/schema' {
  interface NuxtHooks extends ModuleHooks {}
  interface RuntimeConfig extends ModuleRuntimeConfig {}
}

export { default } from './module.mjs'

export { type ModuleHooks, type ModuleOptions, type ModuleRuntimeConfig } from './module.mjs'
