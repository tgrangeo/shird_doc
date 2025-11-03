import { frameData } from "./frame.mjs";
import { MotionGlobalConfig } from "../../../../../../motion-utils@12.23.6/external/motion-utils/dist/es/global-config.mjs";
let now;
function clearTime() {
  now = void 0;
}
const time = {
  now: () => {
    if (now === void 0) {
      time.set(frameData.isProcessing || MotionGlobalConfig.useManualTiming ? frameData.timestamp : performance.now());
    }
    return now;
  },
  set: (newTime) => {
    now = newTime;
    queueMicrotask(clearTime);
  }
};
export {
  time
};
