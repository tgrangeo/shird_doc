import { invariant } from "hey-listen";
import { isSVGElement, resolveVariant } from "./utils.mjs";
import { FeatureManager } from "../features/feature-manager.mjs";
import { doneCallbacks } from "../components/animate-presence/presence.mjs";
import { isVariantLabels } from "./utils/is-variant-labels.mjs";
import { noop } from "../external/.pnpm/motion-utils@12.23.6/external/motion-utils/dist/es/noop.mjs";
import { cancelFrame, frame } from "../external/.pnpm/motion-dom@12.23.12/external/motion-dom/dist/es/frameloop/frame.mjs";
const mountedStates = /* @__PURE__ */ new WeakMap();
let id = 0;
class MotionState {
  constructor(options, parent) {
    var _a;
    this.element = null;
    this.isSafeToRemove = false;
    this.isVShow = false;
    this.children = /* @__PURE__ */ new Set();
    this.activeStates = {
      initial: true,
      animate: true
    };
    this.currentProcess = null;
    this._context = null;
    this.animateUpdates = noop;
    this.id = `motion-state-${id++}`;
    this.options = options;
    this.parent = parent;
    (_a = parent == null ? void 0 : parent.children) == null ? void 0 : _a.add(this);
    const initial = options.initial === void 0 && options.variants ? this.context.initial : options.initial;
    const initialVariantSource = initial === false ? ["initial", "animate"] : ["initial"];
    this.initTarget(initialVariantSource);
    this.featureManager = new FeatureManager(this);
    this.type = isSVGElement(this.options.as) ? "svg" : "html";
  }
  // Get animation context, falling back to parent context for inheritance
  get context() {
    if (!this._context) {
      const handler = {
        get: (target, prop) => {
          var _a;
          return isVariantLabels(this.options[prop]) ? this.options[prop] : (_a = this.parent) == null ? void 0 : _a.context[prop];
        }
      };
      this._context = new Proxy({}, handler);
    }
    return this._context;
  }
  // Initialize animation target values
  initTarget(initialVariantSource) {
    var _a;
    const custom = this.options.custom ?? ((_a = this.options.animatePresenceContext) == null ? void 0 : _a.custom);
    this.baseTarget = initialVariantSource.reduce((acc, variant) => {
      return {
        ...acc,
        ...resolveVariant(this.options[variant] || this.context[variant], this.options.variants, custom)
      };
    }, {});
    this.target = {};
  }
  // Update visual element with new options
  updateOptions(options) {
    var _a;
    this.options = options;
    (_a = this.visualElement) == null ? void 0 : _a.update({
      ...this.options,
      whileTap: this.options.whilePress
    }, {
      isPresent: !doneCallbacks.has(this.element)
    });
  }
  // Called before mounting, executes in parent-to-child order
  beforeMount() {
    this.featureManager.beforeMount();
  }
  // Mount motion state to DOM element, handles parent-child relationships
  mount(element, options, notAnimate = false) {
    var _a, _b;
    invariant(
      Boolean(element),
      "Animation state must be mounted with valid Element"
    );
    this.element = element;
    this.updateOptions(options);
    this.options.layoutId && ((_a = this.visualElement.projection.getStack()) == null ? void 0 : _a.members.length) > 0;
    this.featureManager.mount();
    if (!notAnimate && this.options.animate) {
      (_b = this.startAnimation) == null ? void 0 : _b.call(this);
    }
  }
  clearAnimation() {
    var _a, _b;
    this.currentProcess && cancelFrame(this.currentProcess);
    this.currentProcess = null;
    (_b = (_a = this.visualElement) == null ? void 0 : _a.variantChildren) == null ? void 0 : _b.forEach((child) => {
      child.state.clearAnimation();
    });
  }
  // update trigger animation
  startAnimation() {
    this.clearAnimation();
    this.currentProcess = frame.render(() => {
      this.currentProcess = null;
      this.animateUpdates();
    });
  }
  // Called before unmounting, executes in child-to-parent order
  beforeUnmount() {
    this.featureManager.beforeUnmount();
  }
  unmount(unMountChildren = false) {
    var _a;
    const shouldDelay = this.options.layoutId && ((_a = this.visualElement.projection) == null ? void 0 : _a.getStack().lead) === this.visualElement.projection && this.visualElement.projection.isProjecting();
    const unmountState = () => {
      var _a2, _b, _c;
      if (unMountChildren) {
        Array.from(this.children).reverse().forEach(this.unmountChild);
      }
      (_b = (_a2 = this.parent) == null ? void 0 : _a2.children) == null ? void 0 : _b.delete(this);
      mountedStates.delete(this.element);
      this.featureManager.unmount();
      (_c = this.visualElement) == null ? void 0 : _c.unmount();
      this.clearAnimation();
    };
    if (shouldDelay) {
      Promise.resolve().then(() => {
        unmountState();
      });
    } else {
      unmountState();
    }
  }
  unmountChild(child) {
    child.unmount(true);
  }
  // Called before updating, executes in parent-to-child order
  beforeUpdate() {
    this.featureManager.beforeUpdate();
  }
  // Update motion state with new options
  update(options) {
    this.updateOptions(options);
    this.featureManager.update();
    this.startAnimation();
  }
  // Set animation state active status and propagate to children
  setActive(name, isActive, isAnimate = true) {
    var _a;
    if (!this.element || this.activeStates[name] === isActive)
      return;
    this.activeStates[name] = isActive;
    (_a = this.visualElement.variantChildren) == null ? void 0 : _a.forEach((child) => {
      child.state.setActive(name, isActive, false);
    });
    if (isAnimate) {
      this.animateUpdates({
        isExit: name === "exit" && this.activeStates.exit
      });
    }
  }
  isMounted() {
    return Boolean(this.element);
  }
  // Called before layout updates to prepare for changes
  willUpdate(label) {
    var _a;
    if (this.options.layout || this.options.layoutId) {
      (_a = this.visualElement.projection) == null ? void 0 : _a.willUpdate();
    }
  }
}
export {
  MotionState,
  mountedStates
};
