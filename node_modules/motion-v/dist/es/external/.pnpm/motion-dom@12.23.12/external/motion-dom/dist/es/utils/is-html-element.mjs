import { isObject } from "../../../../../../motion-utils@12.23.6/external/motion-utils/dist/es/is-object.mjs";
function isHTMLElement(element) {
  return isObject(element) && "offsetHeight" in element;
}
export {
  isHTMLElement
};
