import { watch, onMounted } from "vue";
import { createContext } from "../../utils/createContext.mjs";
const doneCallbacks = /* @__PURE__ */ new WeakMap();
function removeDoneCallback(element) {
  const prevDoneCallback = doneCallbacks.get(element);
  if (prevDoneCallback) {
    element.removeEventListener("motioncomplete", prevDoneCallback);
  }
  doneCallbacks.delete(element);
}
const [injectAnimatePresence, provideAnimatePresence] = createContext("AnimatePresenceContext");
function useAnimatePresence(props) {
  const presenceContext = {
    initial: props.initial,
    custom: props.custom
  };
  watch(() => props.custom, (v) => {
    presenceContext.custom = v;
  }, {
    flush: "pre"
  });
  provideAnimatePresence(presenceContext);
  onMounted(() => {
    presenceContext.initial = void 0;
  });
}
export {
  doneCallbacks,
  injectAnimatePresence,
  provideAnimatePresence,
  removeDoneCallback,
  useAnimatePresence
};
