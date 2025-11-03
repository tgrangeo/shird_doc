const cssInlineInstance = { instance: void 0 };
const sharpInstance = { instance: void 0 };
const resvgInstance = { instance: void 0 };
const satoriInstance = { instance: void 0 };
export async function useResvg() {
  resvgInstance.instance = resvgInstance.instance || await import("#og-image/bindings/resvg").then((m) => m.default);
  await resvgInstance.instance.initWasmPromise;
  return resvgInstance.instance.Resvg;
}
export async function useSatori() {
  satoriInstance.instance = satoriInstance.instance || await import("#og-image/bindings/satori").then((m) => m.default);
  await satoriInstance.instance.initWasmPromise;
  return satoriInstance.instance.satori;
}
export async function useSharp() {
  sharpInstance.instance = sharpInstance.instance || await import("#og-image/bindings/sharp").then((m) => m.default);
  return sharpInstance.instance;
}
export async function useCssInline() {
  cssInlineInstance.instance = cssInlineInstance.instance || await import("#og-image/bindings/css-inline").then((m) => m.default);
  await cssInlineInstance.instance.initWasmPromise;
  return cssInlineInstance.instance.cssInline;
}
