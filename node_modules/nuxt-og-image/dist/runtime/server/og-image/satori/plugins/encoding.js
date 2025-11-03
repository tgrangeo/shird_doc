import { decodeHtml } from "../../../util/encoding.js";
import { defineSatoriTransformer } from "../utils.js";
export default defineSatoriTransformer([
  // clean up
  {
    filter: (node) => node.props?.["data-v-inspector"],
    transform: (node) => {
      delete node.props["data-v-inspector"];
    }
  },
  {
    filter: (node) => typeof node.props?.children === "string",
    transform: (node) => {
      node.props.children = decodeHtml(node.props.children);
    }
  }
]);
