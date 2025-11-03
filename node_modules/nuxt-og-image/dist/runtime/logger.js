import { createConsola } from "consola";
import { colorize } from "consola/utils";
export const logger = createConsola({
  defaults: {
    tag: "@nuxtjs/og-image"
  }
});
export const gray = (s) => colorize("gray", s);
