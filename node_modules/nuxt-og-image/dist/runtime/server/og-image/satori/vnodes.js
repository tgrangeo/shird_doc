import { html as convertHtmlToSatori } from "satori-html";
import { htmlDecodeQuotes } from "../../util/encoding.js";
import { fetchIsland } from "../../util/kit.js";
import classes from "./plugins/classes.js";
import emojis from "./plugins/emojis.js";
import encoding from "./plugins/encoding.js";
import flex from "./plugins/flex.js";
import imageSrc from "./plugins/imageSrc.js";
import nuxtIcon from "./plugins/nuxt-icon.js";
import unocss from "./plugins/unocss.js";
import { applyEmojis } from "./transforms/emojis.js";
import { applyInlineCss } from "./transforms/inlineCss.js";
import { walkSatoriTree } from "./utils.js";
export async function createVNodes(ctx) {
  let html = ctx.options.html;
  if (!html) {
    const island = await fetchIsland(ctx.e, ctx.options.component, typeof ctx.options.props !== "undefined" ? ctx.options.props : ctx.options);
    island.html = htmlDecodeQuotes(island.html);
    await applyInlineCss(ctx, island);
    await applyEmojis(ctx, island);
    html = island.html;
    if (html?.includes("<body>")) {
      html = html.match(/<body>([\s\S]*)<\/body>/)?.[1] || "";
    }
  }
  const template = `<div style="position: relative; display: flex; margin: 0 auto; width: ${ctx.options.width}px; height: ${ctx.options.height}px; overflow: hidden;">${html}</div>`;
  const satoriTree = convertHtmlToSatori(template);
  walkSatoriTree(ctx, satoriTree, [
    emojis,
    classes,
    flex,
    encoding,
    nuxtIcon
  ]);
  await Promise.all(walkSatoriTree(ctx, satoriTree, [
    unocss,
    imageSrc
  ]));
  return satoriTree;
}
