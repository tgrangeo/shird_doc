import { doneCallbacks } from "../../components/animate-presence/presence.mjs";
function isPresent(visualElement) {
  return !doneCallbacks.has(visualElement.current);
}
export {
  isPresent
};
