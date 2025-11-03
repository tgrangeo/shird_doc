import { animateSequence } from "./sequence.mjs";
import { animateSubject } from "./subject.mjs";
import { GroupAnimationWithThen } from "../../../../../../../motion-dom@12.23.12/external/motion-dom/dist/es/animation/GroupAnimationWithThen.mjs";
import { removeItem } from "../../../../../../../motion-utils@12.23.6/external/motion-utils/dist/es/array.mjs";
function isSequence(value) {
  return Array.isArray(value) && value.some(Array.isArray);
}
function createScopedAnimate(scope) {
  function scopedAnimate(subjectOrSequence, optionsOrKeyframes, options) {
    let animations = [];
    if (isSequence(subjectOrSequence)) {
      animations = animateSequence(subjectOrSequence, optionsOrKeyframes, scope);
    } else {
      animations = animateSubject(subjectOrSequence, optionsOrKeyframes, options, scope);
    }
    const animation = new GroupAnimationWithThen(animations);
    if (scope) {
      scope.animations.push(animation);
      animation.finished.then(() => {
        removeItem(scope.animations, animation);
      });
    }
    return animation;
  }
  return scopedAnimate;
}
const animate = createScopedAnimate();
export {
  animate,
  createScopedAnimate
};
