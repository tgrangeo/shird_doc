import { createHooks } from "hookable";
import { useNitroApp } from "#imports";
export const llmsHooks = createHooks();
llmsHooks.beforeEach(() => {
  const hooks = Object.values(llmsHooks._hooks || {});
  const hasRegisteredHook = hooks.some((hooksList) => Array.isArray(hooksList) && hooksList.length > 0);
  if (hasRegisteredHook) {
    console.warn("[nuxt-llms] `llmsHooks` are deprecated and will be removed in future versions. Use `useNitroApp().hooks.hook('llms:generate', (event, options) => {})` instead");
  }
});
export function onLLMsGenerate(cb) {
  return useNitroApp().hooks.hook("llms:generate", cb);
}
export function onLLMsGenerateFull(cb) {
  return useNitroApp().hooks.hook("llms:generate:full", cb);
}
