import { fileURLToPath } from 'node:url';
import { join, normalize } from 'pathe';
import { createUnplugin } from 'unplugin';
import { defu } from 'defu';
import tailwind from '@tailwindcss/vite';
import { g as getTemplates, d as defaultOptions, r as resolveColors, a as getDefaultUiConfig } from './shared/ui.Cmctwxv6.mjs';
import MagicString from 'magic-string';
import { genSafeVariableName } from 'knitwork';
import { resolvePathSync } from 'mlly';
import { globSync } from 'tinyglobby';
import AutoImportComponents from 'unplugin-vue-components';
import AutoImport from 'unplugin-auto-import';
import '../dist/runtime/utils/index.js';
import 'node:fs/promises';
import 'scule';
import 'tailwindcss/colors';
import '@nuxt/kit';

function TemplatePlugin(options, appConfig) {
  const templates = getTemplates(options, appConfig.ui);
  const templateKeys = new Set(templates.map((t) => `#build/${t.filename}`));
  return {
    name: "nuxt:ui:templates",
    enforce: "pre",
    resolveId(id) {
      if (templateKeys.has(id + ".ts")) {
        return id.replace("#build/", "virtual:nuxt-ui-templates/") + ".ts";
      }
    },
    loadInclude: (id) => templateKeys.has(id.replace("virtual:nuxt-ui-templates/", "#build/")),
    load(id) {
      id = id.replace("virtual:nuxt-ui-templates/", "#build/");
      return templates.find((t) => `#build/${t.filename}` === id).getContents({});
    }
  };
}

function PluginsPlugin(options) {
  const plugins = globSync(["**/*", "!*.d.ts"], { cwd: join(runtimeDir, "plugins"), absolute: true });
  plugins.unshift(resolvePathSync("../runtime/vue/plugins/head", { extensions: [".ts", ".mjs", ".js"], url: import.meta.url }));
  if (options.colorMode) {
    plugins.push(resolvePathSync("../runtime/vue/plugins/color-mode", { extensions: [".ts", ".mjs", ".js"], url: import.meta.url }));
  }
  return {
    name: "nuxt:ui:plugins",
    enforce: "pre",
    resolveId(id) {
      if (id === "@nuxt/ui/vue-plugin") {
        return "virtual:nuxt-ui-plugins";
      }
    },
    transform(code, id) {
      if (plugins.some((p) => id.startsWith(p)) && code.includes("import.meta.client")) {
        const s = new MagicString(code);
        s.replaceAll("import.meta.client", "true");
        if (s.hasChanged()) {
          return {
            code: s.toString(),
            map: s.generateMap({ hires: true })
          };
        }
      }
    },
    loadInclude: (id) => id === "virtual:nuxt-ui-plugins",
    load() {
      return `
        ${plugins.map((p) => `import ${genSafeVariableName(p)} from "${p}"`).join("\n")}
export default {
  install (app) {
${plugins.map((p) => `    app.use(${genSafeVariableName(p)})`).join("\n")}
  }
}
        `;
    },
    // Argument Vite specific configuration
    vite: {
      config() {
        return {
          // Opt-out Nuxt UI from Vite's pre-bundling,
          // as we need Vite's pipeline to resolve imports like `#imports`
          optimizeDeps: {
            exclude: ["@nuxt/ui"]
          }
        };
      }
    }
  };
}

function AppConfigPlugin(_options, appConfig) {
  return {
    name: "nuxt:ui:app-config",
    enforce: "pre",
    resolveId(id) {
      if (id === "#build/app.config") {
        return "virtual:nuxt-ui-app-config";
      }
    },
    loadInclude: (id) => id === "virtual:nuxt-ui-app-config",
    load() {
      return `
          export default ${JSON.stringify(appConfig)}
        `;
    },
    vite: {
      config() {
        return {
          test: {
            server: {
              deps: {
                inline: ["@nuxt/ui"]
              }
            }
          }
        };
      }
    }
  };
}

function ComponentImportPlugin(options, meta) {
  const components = globSync("**/*.vue", {
    cwd: join(runtimeDir, "components"),
    ignore: [
      !options.colorMode && "color-mode/**/*.vue",
      "content/*.vue",
      "prose/**/*.vue"
    ].filter(Boolean)
  });
  const componentNames = new Set(components.map((c) => `${options.prefix}${c.split("/").pop()?.replace(/\.vue$/, "")}`));
  const componentPaths = new Map(components.map((c) => {
    const name = c.replace(/\.vue$/, "");
    const componentName = `${options.prefix}${name.split("/").pop()}`;
    return [componentName, c];
  }));
  const overrides = globSync("**/*.vue", {
    cwd: join(runtimeDir, "vue/components"),
    ignore: [
      !options.colorMode && "color-mode/**/*.vue"
    ].filter(Boolean)
  });
  const overrideNames = new Set(overrides.map((c) => `${options.prefix}${c.split("/").pop()?.replace(/\.vue$/, "")}`));
  const overridePaths = new Map(overrides.map((c) => {
    const name = c.replace(/\.vue$/, "");
    const componentName = `${options.prefix}${name.split("/").pop()}`;
    return [componentName, c];
  }));
  const inertiaOverrides = globSync("**/*.vue", {
    cwd: join(runtimeDir, "inertia/components")
  });
  const inertiaOverrideNames = new Set(inertiaOverrides.map((c) => `${options.prefix}${c.replace(/\.vue$/, "")}`));
  const pluginOptions = defu(options.components, {
    dts: options.dts ?? true,
    exclude: [
      /[\\/]node_modules[\\/](?!\.pnpm|@nuxt\/ui|@compodium\/examples)/,
      /[\\/]\.git[\\/]/,
      /[\\/]\.nuxt[\\/]/
    ],
    resolvers: [
      (componentName) => {
        if (options.inertia && inertiaOverrideNames.has(componentName)) {
          return { name: "default", from: join(runtimeDir, "inertia/components", `${componentName.slice(options.prefix.length)}.vue`) };
        }
        if (overrideNames.has(componentName)) {
          const relativePath = overridePaths.get(componentName);
          return { name: "default", from: join(runtimeDir, "vue/components", relativePath) };
        }
        if (componentNames.has(componentName)) {
          const relativePath = componentPaths.get(componentName);
          return { name: "default", from: join(runtimeDir, "components", relativePath) };
        }
      }
    ]
  });
  return [
    /**
     * This plugin aims to ensure we override certain components with Vue-compatible versions:
     * <UIcon> and <ULink> currently.
     */
    {
      name: "nuxt:ui:components",
      enforce: "pre",
      resolveId(id, importer) {
        if (!importer || !normalize(importer).includes(runtimeDir)) {
          return;
        }
        if (!RELATIVE_IMPORT_RE.test(id)) {
          return;
        }
        const filename = id.match(/([^/]+)\.vue$/)?.[1];
        if (filename && options.inertia && inertiaOverrideNames.has(`${options.prefix}${filename}`)) {
          return join(runtimeDir, "inertia/components", `${filename}.vue`);
        }
        if (filename && overrideNames.has(`${options.prefix}${filename}`)) {
          const relativePath = overridePaths.get(`${options.prefix}${filename}`);
          return join(runtimeDir, "vue/components", relativePath);
        }
      }
    },
    AutoImportComponents.raw(pluginOptions, meta)
  ];
}
const RELATIVE_IMPORT_RE = /^\.{1,2}\//;

function NuxtEnvironmentPlugin(options) {
  const stubPath = resolvePathSync(options.inertia ? "../runtime/inertia/stubs" : "../runtime/vue/stubs", { extensions: [".ts", ".mjs", ".js"], url: import.meta.url });
  return {
    name: "nuxt:ui",
    enforce: "pre",
    resolveId(id) {
      if (id === "#imports") {
        return stubPath;
      }
    },
    transformInclude(id) {
      return normalize(id).includes(runtimeDir);
    },
    transform(code) {
      if (code.includes("import.meta.client")) {
        const s = new MagicString(code);
        s.replaceAll("import.meta.client", "true");
        if (s.hasChanged()) {
          return {
            code: s.toString(),
            map: s.generateMap({ hires: true })
          };
        }
      }
    }
  };
}

function AutoImportPlugin(options, meta) {
  const pluginOptions = defu(options.autoImport, {
    dts: options.dts ?? true,
    dirs: [join(runtimeDir, "composables"), join(runtimeDir, "vue/composables")]
  });
  return AutoImport.raw(pluginOptions, meta);
}

const runtimeDir = normalize(fileURLToPath(new URL("./runtime", import.meta.url)));
const NuxtUIPlugin = createUnplugin((_options = {}, meta) => {
  const options = defu(_options, { fonts: false }, defaultOptions);
  options.theme = options.theme || {};
  options.theme.colors = resolveColors(options.theme.colors);
  const appConfig = defu({ ui: options.ui, colorMode: options.colorMode }, { ui: getDefaultUiConfig(options.theme.colors) });
  return [
    NuxtEnvironmentPlugin(options),
    ComponentImportPlugin(options, meta),
    AutoImportPlugin(options, meta),
    tailwind(),
    PluginsPlugin(options),
    TemplatePlugin(options, appConfig),
    AppConfigPlugin(options, appConfig),
    {
      name: "nuxt:ui:plugins-duplication-detection",
      vite: {
        configResolved(config) {
          const plugins = config.plugins || [];
          if (plugins.filter((i) => i.name === "unplugin-auto-import").length > 1) {
            throw new Error("[Nuxt UI] Multiple instances of `unplugin-auto-import` detected. Nuxt UI includes `unplugin-auto-import` already, and you can configure it using `autoImport` option in Nuxt UI module options.");
          }
          if (plugins.filter((i) => i.name === "unplugin-vue-components").length > 1) {
            throw new Error("[Nuxt UI] Multiple instances of `unplugin-vue-components` detected. Nuxt UI includes `unplugin-vue-components` already, and you can configure it using `components` option in Nuxt UI module options.");
          }
        }
      }
    }
  ].flat(1);
});

export { NuxtUIPlugin, runtimeDir };
