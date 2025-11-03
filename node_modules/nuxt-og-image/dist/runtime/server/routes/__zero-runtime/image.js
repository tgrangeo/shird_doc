import { defineEventHandler } from "h3";
import { imageEventHandler } from "../../util/eventHandlers.js";
export default defineEventHandler(async (e) => {
  if (import.meta.dev || import.meta.prerender) {
    return await imageEventHandler(e);
  }
  throw new Error("Not supported in zeroRuntime mode.");
});
