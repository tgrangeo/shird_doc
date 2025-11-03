import { defineNuxtPlugin } from "nuxt/app";
import { useRuntimeConfig } from "#imports";
export default defineNuxtPlugin(() => {
  const publicConfig = useRuntimeConfig().public.content;
  if (import.meta.client && publicConfig.wsUrl) {
    import("../internal/websocket.js").then(({ useContentWebSocket }) => useContentWebSocket());
  }
});
