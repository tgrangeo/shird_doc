import { JSAnimation } from "./JSAnimation.mjs";
import { NativeAnimation } from "./NativeAnimation.mjs";
import { replaceTransitionType } from "./utils/replace-transition-type.mjs";
import { replaceStringEasing } from "./waapi/utils/unsupported-easing.mjs";
import { secondsToMilliseconds } from "../../../../../../motion-utils@12.23.6/external/motion-utils/dist/es/time-conversion.mjs";
const sampleDelta = 10;
class NativeAnimationExtended extends NativeAnimation {
  constructor(options) {
    replaceStringEasing(options);
    replaceTransitionType(options);
    super(options);
    if (options.startTime) {
      this.startTime = options.startTime;
    }
    this.options = options;
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * Rather than read commited styles back out of the DOM, we can
   * create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to calculate velocity for any subsequent animation.
   */
  updateMotionValue(value) {
    const { motionValue, onUpdate, onComplete, element, ...options } = this.options;
    if (!motionValue)
      return;
    if (value !== void 0) {
      motionValue.set(value);
      return;
    }
    const sampleAnimation = new JSAnimation({
      ...options,
      autoplay: false
    });
    const sampleTime = secondsToMilliseconds(this.finishedTime ?? this.time);
    motionValue.setWithVelocity(sampleAnimation.sample(sampleTime - sampleDelta).value, sampleAnimation.sample(sampleTime).value, sampleDelta);
    sampleAnimation.stop();
  }
}
export {
  NativeAnimationExtended
};
