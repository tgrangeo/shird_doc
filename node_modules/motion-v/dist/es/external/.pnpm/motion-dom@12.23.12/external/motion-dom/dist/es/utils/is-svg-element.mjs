import { isObject } from "../../../../../../motion-utils@12.23.6/external/motion-utils/dist/es/is-object.mjs";
function isSVGElement(element) {
  return isObject(element) && "ownerSVGElement" in element;
}
export {
  isSVGElement
};
