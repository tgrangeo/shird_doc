import { defineOgImage } from "./defineOgImage.js";
export function defineOgImageComponent(component, props = {}, options = {}) {
  return defineOgImage({
    ...options,
    component,
    props
  });
}
