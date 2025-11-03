import { isMotionValue } from "../../../../../../../motion-dom@12.23.12/external/motion-dom/dist/es/value/utils/is-motion-value.mjs";
function isWillChangeMotionValue(value) {
  return Boolean(isMotionValue(value) && value.add);
}
export {
  isWillChangeMotionValue
};
