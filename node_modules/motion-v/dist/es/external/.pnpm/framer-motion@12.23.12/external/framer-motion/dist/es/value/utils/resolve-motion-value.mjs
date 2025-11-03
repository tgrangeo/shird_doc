import { isMotionValue } from "../../../../../../../motion-dom@12.23.12/external/motion-dom/dist/es/value/utils/is-motion-value.mjs";
function resolveMotionValue(value) {
  return isMotionValue(value) ? value.get() : value;
}
export {
  resolveMotionValue
};
