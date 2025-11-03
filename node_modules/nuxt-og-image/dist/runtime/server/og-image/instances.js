const satoriRendererInstance = { instance: void 0 };
const chromiumRendererInstance = { instance: void 0 };
export async function useSatoriRenderer() {
  satoriRendererInstance.instance = satoriRendererInstance.instance || await import("#og-image/renderers/satori").then((m) => m.default);
  return satoriRendererInstance.instance;
}
export async function useChromiumRenderer() {
  chromiumRendererInstance.instance = chromiumRendererInstance.instance || await import("#og-image/renderers/chromium").then((m) => m.default);
  return chromiumRendererInstance.instance;
}
