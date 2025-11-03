import { defineSatoriTransformer } from "../utils.js";
function safeSplit(s) {
  const [key, value] = s.split(":");
  return [String(key || "").trim(), String(value || "").trim()];
}
export default defineSatoriTransformer({
  filter: (node) => !!node.props?.class,
  transform: async (node, ctx) => {
    const classes = node.props.class || "";
    const styles = node.props.style || {};
    const replacedClasses = /* @__PURE__ */ new Set();
    for (const token of classes.split(" ").filter((c) => c.trim())) {
      const parsedToken = await ctx.unocss.parseToken(token);
      if (parsedToken) {
        const inlineStyles = String(parsedToken?.[0]?.[2]).split(";").filter((s) => !!s?.trim());
        const vars = {
          "--color-gray-50": "249 250 251",
          "--color-gray-100": "243 244 246",
          "--color-gray-200": "229 231 235",
          "--color-gray-300": "209 213 219",
          "--color-gray-400": "156 163 175",
          "--color-gray-500": "107 114 128",
          "--color-gray-600": "75 85 99",
          "--color-gray-700": "55 65 81",
          "--color-gray-800": "31 41 55",
          "--color-gray-900": "17 24 39",
          "--color-gray-950": "3 7 18"
        };
        inlineStyles.filter((s) => s.startsWith("--")).forEach((s) => {
          const [key, value] = safeSplit(s);
          vars[key] = value;
        });
        inlineStyles.filter((s) => !s.startsWith("--")).forEach((s) => {
          const [key, value] = safeSplit(s);
          const camelCasedKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
          if (!styles[camelCasedKey])
            styles[camelCasedKey] = value.replace(/var\((.*?)\)/g, (_, k) => vars[k.trim()]);
          if (styles[camelCasedKey] && styles[camelCasedKey].includes("/")) {
            const [rgb, opacity] = styles[camelCasedKey].split("/");
            if (rgb && opacity) {
              if (opacity.trim() === "1)")
                styles[camelCasedKey] = rgb.replace(/(\d+) (\d+) (\d+).*/, (_, r, g, b) => `${r}, ${g}, ${b})`);
              else
                styles[camelCasedKey] = `${rgb.replace("rgb", "rgba").replaceAll(" ", ", ")}${opacity.trim()}`;
            }
          }
        });
        replacedClasses.add(token);
      }
    }
    node.props.class = classes.split(" ").filter((c) => !replacedClasses.has(c)).join(" ");
    node.props.tw = classes.split(" ").filter((c) => !replacedClasses.has(c)).join(" ");
    node.props.style = styles;
  }
});
