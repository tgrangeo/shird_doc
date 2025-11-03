import { defineSatoriTransformer } from "../utils.js";
export default defineSatoriTransformer([
  {
    filter: (node) => !!node.props?.class && !node.props?.tw,
    transform(node) {
      node.props.tw = node.props.class;
      node.props.tw = node.props.tw.replace(/icon|inline-style/g, "");
    }
  },
  {
    filter: (node) => !!node.props?.style?.display,
    transform(node) {
      if (["inline-block", "inline"].includes(node.props.style.display))
        delete node.props.style.display;
    }
  }
]);
