import { useNitroOrigin } from "#site-config/server/composables/useNitroOrigin";
import sizeOf from "image-size";
import { useStorage } from "nitropack/runtime";
import { withBase, withoutLeadingSlash } from "ufo";
import { toBase64Image } from "../../../../shared.js";
import { decodeHtml } from "../../../util/encoding.js";
import { logger } from "../../../util/logger.js";
import { defineSatoriTransformer } from "../utils.js";
async function resolveLocalFilePathImage(publicStoragePath, src) {
  const normalizedSrc = withoutLeadingSlash(
    src.replace("_nuxt/@fs/", "").replace("_nuxt/", "").replace("./", "")
  );
  const key = `${publicStoragePath}:${normalizedSrc}`;
  if (await useStorage().hasItem(key))
    return await useStorage().getItemRaw(key);
}
export default defineSatoriTransformer([
  // fix <img src="">
  {
    filter: (node) => node.type === "img" && node.props?.src,
    transform: async (node, { e, publicStoragePath, runtimeConfig }) => {
      let src = node.props.src;
      const isRelative = src.startsWith("/");
      let dimensions;
      let imageBuffer;
      if (src.endsWith(".webp")) {
        logger.warn("Using WebP images with Satori is not supported. Please consider switching image format or use the chromium renderer.", src);
      }
      if (isRelative) {
        if (import.meta.prerender || import.meta.dev) {
          const srcWithoutBase = src.replace(runtimeConfig.app.baseURL, "");
          imageBuffer = await resolveLocalFilePathImage(publicStoragePath, srcWithoutBase);
        }
        if (!imageBuffer) {
          imageBuffer = await e.$fetch(src, { responseType: "arrayBuffer" }).catch(() => {
          });
          if (!imageBuffer && !import.meta.prerender) {
            imageBuffer = await e.$fetch(src, {
              baseURL: useNitroOrigin(e),
              responseType: "arrayBuffer"
            }).catch(() => {
            });
          }
        }
        if (imageBuffer) {
          const buffer = imageBuffer instanceof ArrayBuffer ? imageBuffer : imageBuffer.buffer;
          node.props.src = toBase64Image(buffer);
        }
      } else if (!src.startsWith("data:")) {
        src = decodeHtml(src);
        node.props.src = src;
        imageBuffer = await $fetch(src, {
          responseType: "arrayBuffer"
        }).catch(() => {
        });
      }
      if (imageBuffer && (!node.props.width || !node.props.height)) {
        try {
          const imageSize = sizeOf(imageBuffer);
          dimensions = { width: imageSize.width, height: imageSize.height };
        } catch {
        }
        if (dimensions?.width && dimensions?.height) {
          const naturalAspectRatio = dimensions.width / dimensions.height;
          if (node.props.width && !node.props.height) {
            node.props.height = Math.round(node.props.width / naturalAspectRatio);
          } else if (node.props.height && !node.props.width) {
            node.props.width = Math.round(node.props.height * naturalAspectRatio);
          } else if (!node.props.width && !node.props.height) {
            node.props.width = dimensions.width;
            node.props.height = dimensions.height;
          }
        }
      }
      if (typeof node.props.src === "string" && node.props.src.startsWith("/")) {
        if (imageBuffer) {
          const buffer = imageBuffer instanceof ArrayBuffer ? imageBuffer : imageBuffer.buffer;
          node.props.src = toBase64Image(buffer);
        } else {
          node.props.src = `${withBase(src, `${useNitroOrigin(e)}`)}?${Date.now()}`;
        }
      }
    }
  },
  // fix style="background-image: url('')"
  {
    filter: (node) => node.props?.style?.backgroundImage?.includes("url("),
    transform: async (node, { e, publicStoragePath, runtimeConfig }) => {
      const backgroundImage = node.props.style.backgroundImage;
      const src = backgroundImage.replace(/^url\(['"]?/, "").replace(/['"]?\)$/, "");
      const isRelative = src?.startsWith("/");
      if (isRelative) {
        if (import.meta.prerender || import.meta.dev) {
          const srcWithoutBase = src.replace(runtimeConfig.app.baseURL, "/");
          const imageBuffer = await resolveLocalFilePathImage(publicStoragePath, srcWithoutBase);
          if (imageBuffer) {
            const buffer = imageBuffer instanceof ArrayBuffer ? imageBuffer : imageBuffer.buffer;
            const base64 = toBase64Image(buffer);
            node.props.style.backgroundImage = `url(${base64})`;
          }
        } else {
          node.props.style.backgroundImage = `url(${withBase(src, `${useNitroOrigin(e)}`)}?${Date.now()})`;
        }
      }
    }
  }
]);
