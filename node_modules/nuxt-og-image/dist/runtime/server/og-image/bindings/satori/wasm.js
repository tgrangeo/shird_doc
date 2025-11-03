import { init } from "satori";
import _satori from "satori/wasm";
import initYoga from "yoga-wasm-web";
const wasm = import("yoga-wasm-web/dist/yoga.wasm?module").then(async (yoga) => await initYoga(yoga.default || yoga));
export default {
  initWasmPromise: new Promise((resolve) => {
    wasm.then((yoga) => {
      init(yoga);
      resolve();
    });
  }),
  satori: _satori
};
