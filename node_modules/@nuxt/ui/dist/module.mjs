import { defu } from 'defu';
import { defineNuxtModule, createResolver, addPlugin, hasNuxtModule, addComponentsDir, addImportsDir, installModule } from '@nuxt/kit';
import { d as defaultOptions, r as resolveColors, a as getDefaultUiConfig, b as addTemplates } from './shared/ui.Cmctwxv6.mjs';
import '../dist/runtime/utils/index.js';
import 'node:url';
import 'node:fs/promises';
import 'pathe';
import 'tinyglobby';
import 'scule';
import 'knitwork';
import 'tailwindcss/colors';

const name = "@nuxt/ui";
const version = "4.1.0";

const module = defineNuxtModule({
  meta: {
    name,
    version,
    docs: "https://ui.nuxt.com/docs/getting-started/installation/nuxt",
    configKey: "ui",
    compatibility: {
      nuxt: ">=4.0.0"
    }
  },
  defaults: defaultOptions,
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    options.theme = options.theme || {};
    options.theme.colors = resolveColors(options.theme.colors);
    nuxt.options.ui = options;
    nuxt.options.alias["#ui"] = resolve("./runtime");
    nuxt.options.appConfig.ui = defu(nuxt.options.appConfig.ui || {}, getDefaultUiConfig(options.theme.colors));
    nuxt.options.app.rootAttrs = nuxt.options.app.rootAttrs || {};
    nuxt.options.app.rootAttrs.class = [nuxt.options.app.rootAttrs.class, "isolate"].filter(Boolean).join(" ");
    nuxt.hook("vite:extend", async ({ config }) => {
      const plugin = await import('@tailwindcss/vite').then((r) => r.default);
      config.plugins ||= [];
      config.plugins.push(plugin());
    });
    if (nuxt.options.builder !== "@nuxt/vite-builder") {
      nuxt.options.postcss.plugins["@tailwindcss/postcss"] = {};
    }
    async function registerModule(name2, key, options2) {
      if (!hasNuxtModule(name2)) {
        await installModule(name2, defu(nuxt.options[key], options2));
      } else {
        nuxt.options[key] = defu(nuxt.options[key], options2);
      }
    }
    await registerModule("@nuxt/icon", "icon", {
      cssLayer: "components"
    });
    if (options.fonts) {
      await registerModule("@nuxt/fonts", "fonts", {
        defaults: {
          weights: [400, 500, 600, 700]
        }
      });
    }
    if (options.colorMode) {
      await registerModule("@nuxtjs/color-mode", "colorMode", {
        classSuffix: "",
        disableTransition: true
      });
    }
    addPlugin({ src: resolve("./runtime/plugins/colors") });
    if (hasNuxtModule("@nuxtjs/mdc") || options.mdc || (hasNuxtModule("@nuxt/content") || options.content)) {
      nuxt.options.mdc = defu(nuxt.options.mdc, {
        highlight: {
          theme: {
            light: "material-theme-lighter",
            default: "material-theme",
            dark: "material-theme-palenight"
          }
        },
        components: {
          map: {
            "accordion": "ProseAccordion",
            "accordion-item": "ProseAccordionItem",
            "badge": "ProseBadge",
            "callout": "ProseCallout",
            "card": "ProseCard",
            "card-group": "ProseCardGroup",
            "caution": "ProseCaution",
            "code-collapse": "ProseCodeCollapse",
            "code-group": "ProseCodeGroup",
            "code-icon": "ProseCodeIcon",
            "code-preview": "ProseCodePreview",
            "code-tree": "ProseCodeTree",
            "collapsible": "ProseCollapsible",
            "field": "ProseField",
            "field-group": "ProseFieldGroup",
            "icon": "ProseIcon",
            "kbd": "ProseKbd",
            "note": "ProseNote",
            "steps": "ProseSteps",
            "tabs": "ProseTabs",
            "tabs-item": "ProseTabsItem",
            "tip": "ProseTip",
            "warning": "ProseWarning"
          }
        }
      });
      addComponentsDir({
        path: resolve("./runtime/components/prose"),
        pathPrefix: false,
        prefix: "Prose",
        global: true
      });
    }
    if (hasNuxtModule("@nuxt/content") || options.content) {
      addComponentsDir({
        path: resolve("./runtime/components/content"),
        pathPrefix: false,
        prefix: options.prefix
      });
    }
    if (hasNuxtModule("@nuxtjs/color-mode")) {
      addComponentsDir({
        path: resolve("./runtime/components/color-mode"),
        pathPrefix: false,
        prefix: options.prefix
      });
    } else {
      addImportsDir(resolve("./runtime/composables/color-mode"));
    }
    addComponentsDir({
      path: resolve("./runtime/components"),
      pathPrefix: false,
      prefix: options.prefix,
      ignore: ["color-mode/**", "content/**", "prose/**"]
    });
    addImportsDir(resolve("./runtime/composables"));
    addTemplates(options, nuxt, resolve);
  }
});

export { module as default };
