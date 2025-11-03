import { defineNitroPlugin } from "nitropack/runtime";
import { nuxtContentPlugin } from "../util/plugins.js";
export default defineNitroPlugin((nitroApp) => {
  nuxtContentPlugin(nitroApp);
});
