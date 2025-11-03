'use strict';

const fs = require('node:fs');
const promises = require('node:fs/promises');
const kit = require('@nuxt/kit');
const defu = require('defu');
const kit$1 = require('nuxt-site-config/kit');
const ohash = require('ohash');
const pathe = require('pathe');
const pkgTypes = require('pkg-types');
const stdEnv = require('std-env');
const ufo = require('ufo');
const unstorage = require('unstorage');
const fsDriver = require('unstorage/drivers/fs');
const node_crypto = require('node:crypto');
const nypm = require('nypm');
const chromeLauncher = require('chrome-launcher');
const ofetch = require('ofetch');
const node_path = require('node:path');
const devtoolsKit = require('@nuxt/devtools-kit');
const node_url = require('node:url');
const MagicString = require('magic-string');
const stripLiteral = require('strip-literal');
const unplugin = require('unplugin');
const logger_js = require('../dist/runtime/logger.js');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

function _interopNamespaceCompat(e) {
  if (e && typeof e === 'object' && 'default' in e) return e;
  const n = Object.create(null);
  if (e) {
    for (const k in e) {
      n[k] = e[k];
    }
  }
  n.default = e;
  return n;
}

const fs__namespace = /*#__PURE__*/_interopNamespaceCompat(fs);
const fsDriver__default = /*#__PURE__*/_interopDefaultCompat(fsDriver);
const MagicString__default = /*#__PURE__*/_interopDefaultCompat(MagicString);

const isUndefinedOrTruthy = (v) => typeof v === "undefined" || v !== false;
function checkLocalChrome() {
  if (stdEnv.isCI)
    return false;
  let hasChromeLocally = false;
  try {
    hasChromeLocally = !!chromeLauncher.Launcher.getFirstInstallation();
  } catch {
  }
  return hasChromeLocally;
}
async function hasResolvableDependency(dep) {
  return await kit.resolvePath(dep, { fallbackToOriginal: true }).catch(() => null).then((r) => r && r !== dep);
}
async function downloadFont(font, storage, mirror) {
  const { name, weight, style } = font;
  const key = `${name}-${style}-${weight}.ttf.base64`;
  if (await storage.hasItem(key))
    return { success: true };
  const host = typeof mirror === "undefined" ? "fonts.googleapis.com" : mirror === true ? "fonts.font.im" : mirror;
  const cssUrl = `https://${host}/css2?family=${name}:${style === "ital" ? `ital,wght@1,${weight}` : `wght@${weight}`}`;
  const css = await ofetch.$fetch(cssUrl, {
    timeout: 10 * 1e3,
    // 10 second timeout
    headers: {
      // Make sure it returns TTF.
      "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1"
    }
  }).catch((err) => {
    return { error: err };
  });
  if (!css || typeof css !== "string")
    return { success: false, error: css?.error || new Error(`Failed to fetch CSS from ${cssUrl}`), host };
  const ttfResource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);
  if (ttfResource?.[1]) {
    const buf = await ofetch.$fetch(ttfResource[1], { responseType: "arrayBuffer" }).catch((err) => {
      return { error: err };
    });
    if (buf && "error" in buf)
      return { success: false, error: buf.error, host, fontUrl: ttfResource[1] };
    const base64Font = Buffer.from(buf).toString("base64");
    await storage.setItem(key, base64Font);
    return { success: true };
  }
  return { success: false, error: new Error("No TTF resource found in CSS response"), host };
}

const autodetectableProviders = {
  azure_static: "azure",
  cloudflare_pages: "cloudflare-pages",
  netlify: "netlify",
  stormkit: "stormkit",
  vercel: "vercel",
  cleavr: "cleavr",
  stackblitz: "stackblitz"
};
const autodetectableStaticProviders = {
  netlify: "netlify-static",
  vercel: "vercel-static"
};
const NodeRuntime = {
  // node-server runtime
  "chromium": "on-demand",
  // this gets changed build start
  "css-inline": "node",
  "resvg": "node",
  "satori": "node",
  "sharp": "node"
  // will be disabled if they're missing the dependency
};
const cloudflare = {
  "chromium": false,
  "css-inline": false,
  "resvg": "wasm",
  "satori": "node",
  "sharp": false,
  "wasm": {
    esmImport: true,
    lazy: true
  }
};
const awsLambda = {
  "chromium": false,
  "css-inline": "wasm",
  "resvg": "node",
  "satori": "node",
  "sharp": false
  // 0.33.x has issues
};
const WebContainer = {
  "chromium": false,
  "css-inline": "wasm-fs",
  "resvg": "wasm-fs",
  "satori": "wasm-fs",
  "sharp": false
};
const RuntimeCompatibility = {
  "nitro-dev": NodeRuntime,
  "nitro-prerender": NodeRuntime,
  "node-server": NodeRuntime,
  "stackblitz": WebContainer,
  "codesandbox": WebContainer,
  "aws-lambda": awsLambda,
  "netlify": awsLambda,
  "netlify-edge": {
    "chromium": false,
    "css-inline": "wasm",
    "resvg": "wasm",
    "satori": "node",
    "sharp": false,
    "wasm": {
      // @ts-expect-error untyped
      rollup: {
        targetEnv: "auto-inline",
        sync: ["@resvg/resvg-wasm/index_bg.wasm"]
      }
    }
  },
  "firebase": awsLambda,
  "vercel": awsLambda,
  "vercel-edge": {
    "chromium": false,
    "css-inline": false,
    // size constraint (2mb is max)
    "resvg": "wasm",
    "satori": "node",
    "sharp": false,
    "wasm": {
      // lowers workers kb size
      esmImport: true,
      lazy: true
    }
  },
  "cloudflare-pages": cloudflare,
  "cloudflare": cloudflare,
  "cloudflare-module": cloudflare
};
function detectTarget(options = {}) {
  return options?.static ? autodetectableStaticProviders[stdEnv.provider] : autodetectableProviders[stdEnv.provider];
}
function resolveNitroPreset(nitroConfig) {
  if (stdEnv.provider === "stackblitz" || stdEnv.provider === "codesandbox")
    return stdEnv.provider;
  const nuxt = kit.useNuxt();
  if (nuxt.options.dev)
    return "nitro-dev";
  if (nuxt.options._generate || nuxt.options.nitro.static)
    return "nitro-prerender";
  let preset;
  if (nitroConfig && nitroConfig?.preset)
    preset = nitroConfig.preset;
  if (!preset)
    preset = stdEnv.env.NITRO_PRESET || stdEnv.env.SERVER_PRESET || detectTarget() || "node-server";
  return preset.replace("_", "-");
}
function getPresetNitroPresetCompatibility(target) {
  let compatibility = RuntimeCompatibility[target];
  if (!compatibility)
    compatibility = RuntimeCompatibility["nitro-dev"];
  return compatibility;
}
async function applyNitroPresetCompatibility(nitroConfig, options) {
  const target = resolveNitroPreset(nitroConfig);
  const compatibility = getPresetNitroPresetCompatibility(target);
  const hasCssInlineNode = await hasResolvableDependency("@css-inline/css-inline");
  const hasCssInlineWasm = await hasResolvableDependency("@css-inline/css-inline-wasm");
  const { resolve } = options;
  const satoriEnabled = typeof options.compatibility?.satori !== "undefined" ? !!options.compatibility.satori : !!compatibility.satori;
  const chromiumEnabled = typeof options.compatibility?.chromium !== "undefined" ? !!options.compatibility.chromium : !!compatibility.chromium;
  const emptyMock = await resolve.resolvePath("./runtime/mock/empty");
  nitroConfig.alias["#og-image/renderers/satori"] = satoriEnabled ? await resolve.resolvePath("./runtime/server/og-image/satori/renderer") : emptyMock;
  nitroConfig.alias["#og-image/renderers/chromium"] = chromiumEnabled ? await resolve.resolvePath("./runtime/server/og-image/chromium/renderer") : emptyMock;
  const resolvedCompatibility = {};
  async function applyBinding(key) {
    let binding = options.compatibility?.[key];
    if (typeof binding === "undefined")
      binding = compatibility[key];
    if (key === "chromium" && binding === "node")
      binding = "playwright";
    if (key === "css-inline" && typeof binding === "string") {
      if (binding === "node" && !hasCssInlineNode || ["wasm", "wasm-fs"].includes(binding) && !hasCssInlineWasm) {
        binding = false;
      }
    }
    resolvedCompatibility[key] = binding;
    return {
      [`#og-image/bindings/${key}`]: binding === false ? emptyMock : await resolve.resolvePath(`./runtime/server/og-image/bindings/${key}/${binding}`)
    };
  }
  nitroConfig.alias = defu.defu(
    await applyBinding("chromium"),
    await applyBinding("satori"),
    await applyBinding("resvg"),
    await applyBinding("sharp"),
    await applyBinding("css-inline"),
    nitroConfig.alias || {}
  );
  if (Object.values(compatibility).includes("wasm")) {
    nitroConfig.experimental = nitroConfig.experimental || {};
    nitroConfig.experimental.wasm = true;
  }
  nitroConfig.rollupConfig = nitroConfig.rollupConfig || {};
  nitroConfig.wasm = defu.defu(compatibility.wasm, nitroConfig.wasm);
  nitroConfig.virtual["#og-image/compatibility"] = () => `export default ${JSON.stringify(resolvedCompatibility)}`;
  kit.addTemplate({
    filename: "nuxt-og-image/compatibility.mjs",
    getContents() {
      return `export default ${JSON.stringify(resolvedCompatibility)}`;
    },
    options: { mode: "server" }
  });
  return resolvedCompatibility;
}
function ensureDependencies(dep, nuxt = kit.useNuxt()) {
  return Promise.all(dep.map((d) => {
    return nypm.ensureDependencyInstalled(d, {
      cwd: nuxt.options.rootDir,
      dev: true
    });
  }));
}

async function setupBuildHandler(config, resolve, nuxt = kit.useNuxt()) {
  nuxt.options.nitro.storage = nuxt.options.nitro.storage || {};
  if (typeof config.runtimeCacheStorage === "object")
    nuxt.options.nitro.storage["og-image"] = config.runtimeCacheStorage;
  const proxyCjs = await resolve.resolvePath("./runtime/mock/proxy-cjs");
  nuxt.hooks.hook("nitro:config", async (nitroConfig) => {
    await applyNitroPresetCompatibility(nitroConfig, { compatibility: config.compatibility?.runtime, resolve });
    nitroConfig.alias.electron = proxyCjs;
    nitroConfig.alias.bufferutil = proxyCjs;
    nitroConfig.alias["utf-8-validate"] = proxyCjs;
    nitroConfig.alias.queue = proxyCjs;
    nitroConfig.alias["chromium-bidi"] = proxyCjs;
  });
  nuxt.hooks.hook("nitro:init", async (nitro) => {
    const target = resolveNitroPreset(nitro.options);
    const isCloudflarePagesOrModule = target === "cloudflare-pages" || target === "cloudflare-module";
    if (isCloudflarePagesOrModule) {
      nitro.options.cloudflare = nitro.options.cloudflare || {};
      nitro.options.cloudflare.pages = nitro.options.cloudflare.pages || {};
      nitro.options.cloudflare.pages.routes = nitro.options.cloudflare.pages.routes || { exclude: [] };
      nitro.options.cloudflare.pages.routes.exclude = nitro.options.cloudflare.pages.routes.exclude || [];
      nitro.options.cloudflare.pages.routes.exclude.push("/__og-image__/static/*");
    }
    nitro.hooks.hook("compiled", async (_nitro) => {
      const compatibility = getPresetNitroPresetCompatibility(target);
      if (compatibility.wasm?.esmImport !== true)
        return;
      const configuredEntry = nitro.options.rollupConfig?.output.entryFileNames;
      const serverEntry = resolve.resolve(_nitro.options.output.serverDir, typeof configuredEntry === "string" ? configuredEntry : "index.mjs");
      const wasmEntries = [serverEntry];
      if (isCloudflarePagesOrModule) {
        wasmEntries.push(resolve.resolve(pathe.dirname(serverEntry), "./chunks/wasm.mjs"));
        wasmEntries.push(resolve.resolve(pathe.dirname(serverEntry), "./chunks/_/wasm.mjs"));
        wasmEntries.push(resolve.resolve(pathe.dirname(serverEntry), "./chunks/index_bg.mjs"));
      }
      const resvgHash = await resolveFilePathSha1("@resvg/resvg-wasm/index_bg.wasm");
      const yogaHash = await resolveFilePathSha1("yoga-wasm-web/dist/yoga.wasm");
      const cssInlineHash = await resolveFilePathSha1("@css-inline/css-inline-wasm/index_bg.wasm");
      for (const entry of wasmEntries) {
        if (!fs.existsSync(entry))
          continue;
        const contents = await promises.readFile(serverEntry, "utf-8");
        const postfix = target === "vercel-edge" ? "?module" : "";
        const path = isCloudflarePagesOrModule ? `../wasm/` : `./wasm/`;
        await promises.writeFile(serverEntry, contents.replaceAll('"@resvg/resvg-wasm/index_bg.wasm?module"', `"${path}index_bg-${resvgHash}.wasm${postfix}"`).replaceAll('"@css-inline/css-inline-wasm/index_bg.wasm?module"', `"${path}index_bg-${cssInlineHash}.wasm${postfix}"`).replaceAll('"yoga-wasm-web/dist/yoga.wasm?module"', `"${path}yoga-${yogaHash}.wasm${postfix}"`), { encoding: "utf-8" });
      }
    });
  });
}
async function resolveFilePathSha1(path) {
  const _path = await kit.resolvePath(path);
  return sha1(fs.existsSync(_path) ? await promises.readFile(_path) : Buffer.from(path));
}
function sha1(source) {
  return node_crypto.createHash("sha1").update(source).digest("hex").slice(0, 16);
}

function setupDevHandler(options, resolve, nuxt = kit.useNuxt()) {
  nuxt.hooks.hook("nitro:config", async (nitroConfig) => {
    await applyNitroPresetCompatibility(nitroConfig, { compatibility: options.compatibility?.dev, resolve });
  });
}

const DEVTOOLS_UI_ROUTE = "/__nuxt-og-image";
const DEVTOOLS_UI_LOCAL_PORT = 3030;
function setupDevToolsUI(options, resolve, nuxt = kit.useNuxt()) {
  const clientPath = resolve("./client");
  const isProductionBuild = fs.existsSync(clientPath);
  if (isProductionBuild) {
    nuxt.hook("vite:serverCreated", async (server) => {
      const sirv = await import('sirv').then((r) => r.default || r);
      server.middlewares.use(
        DEVTOOLS_UI_ROUTE,
        sirv(clientPath, { dev: true, single: true })
      );
    });
  } else {
    nuxt.hook("vite:extendConfig", (config) => {
      config.server = config.server || {};
      config.server.proxy = config.server.proxy || {};
      config.server.proxy[DEVTOOLS_UI_ROUTE] = {
        target: `http://localhost:${DEVTOOLS_UI_LOCAL_PORT}${DEVTOOLS_UI_ROUTE}`,
        changeOrigin: true,
        followRedirects: true,
        rewrite: (path) => path.replace(DEVTOOLS_UI_ROUTE, "")
      };
    });
  }
  const useNitro = new Promise((resolve2) => {
    nuxt.hooks.hook("nitro:init", resolve2);
  });
  devtoolsKit.onDevToolsInitialized(async () => {
    const rpc = devtoolsKit.extendServerRpc("nuxt-og-image", {
      async ejectCommunityTemplate(path) {
        const [dirName, componentName] = path.split("/");
        const dir = resolve(nuxt.options.rootDir, "components", dirName || "");
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        const newPath = resolve(dir, componentName || "");
        const templatePath = resolve(`./runtime/app/components/Templates/Community/${componentName}`);
        const template = (await promises.readFile(templatePath, "utf-8")).replace("{{ title }}", `{{ title }} - Ejected!`);
        await promises.writeFile(newPath, template, { encoding: "utf-8" });
        await kit.updateTemplates({ filter: (t) => t.filename.includes("nuxt-og-image/components.mjs") });
        const nitro = await useNitro;
        await nitro.hooks.callHook("rollup:reload");
        return newPath;
      }
    });
    nuxt.hook("builder:watch", (e, path) => {
      path = node_path.relative(nuxt.options.srcDir, resolve(nuxt.options.srcDir, path));
      if ((e === "change" || e.includes("link")) && (path.startsWith("pages") || path.startsWith("content"))) {
        rpc.broadcast.refreshRouteData(path).catch(() => {
        });
      }
      if (options.componentDirs.some((dir) => path.includes(dir))) {
        if (e === "change") {
          rpc.broadcast.refresh().catch(() => {
          });
        } else {
          rpc.broadcast.refreshGlobalData().catch(() => {
          });
        }
      }
    });
  });
  nuxt.hook("devtools:customTabs", (tabs) => {
    tabs.push({
      // unique identifier
      name: "nuxt-og-image",
      // title to display in the tab
      title: "OG Image",
      // any icon from Iconify, or a URL to an image
      icon: "carbon:image-search",
      // iframe view
      view: {
        type: "iframe",
        src: DEVTOOLS_UI_ROUTE
      }
    });
  });
}

function setupGenerateHandler(options, resolve, nuxt = kit.useNuxt()) {
  nuxt.hooks.hook("nitro:config", async (nitroConfig) => {
    await applyNitroPresetCompatibility(nitroConfig, {
      compatibility: {
        "chromium": false,
        "satori": false,
        "css-inline": false,
        "resvg": false,
        "sharp": false
      },
      resolve
    });
  });
}

function setupPrerenderHandler(options, resolve, nuxt = kit.useNuxt()) {
  nuxt.hooks.hook("nitro:init", async (nitro) => {
    nitro.hooks.hook("prerender:config", async (nitroConfig) => {
      await applyNitroPresetCompatibility(nitroConfig, { compatibility: options.compatibility?.prerender, resolve });
      nitroConfig.wasm = nitroConfig.wasm || {};
      nitroConfig.wasm.esmImport = false;
    });
  });
}

function isVue(id, opts = {}) {
  const { search } = ufo.parseURL(decodeURIComponent(node_url.pathToFileURL(id).href));
  if (id.endsWith(".vue") && !search) {
    return true;
  }
  if (!search) {
    return false;
  }
  const query = ufo.parseQuery(search);
  if (query.nuxt_component) {
    return false;
  }
  if (query.macro && (search === "?macro=true" || !opts.type || opts.type.includes("script"))) {
    return true;
  }
  const type = "setup" in query ? "script" : query.type;
  if (!("vue" in query) || opts.type && !opts.type.includes(type)) {
    return false;
  }
  return true;
}
const JS_RE = /\.(?:[cm]?j|t)sx?$/;
function isJS(id) {
  const { pathname } = ufo.parseURL(decodeURIComponent(node_url.pathToFileURL(id).href));
  return JS_RE.test(pathname);
}
const TreeShakeComposablesPlugin = unplugin.createUnplugin(() => {
  const composableNames = [
    "defineOgImage",
    "defineOgImageComponent",
    "defineOgImageScreenshot"
  ];
  const regexp = `(^\\s*)(${composableNames.join("|")})(?=\\((?!\\) \\{))`;
  const COMPOSABLE_RE = new RegExp(regexp, "m");
  const COMPOSABLE_RE_GLOBAL = new RegExp(regexp, "gm");
  return {
    name: "nuxt-og-image:zero-runtime:transform",
    enforce: "pre",
    transformInclude(id) {
      return isVue(id, { type: ["script"] }) || isJS(id);
    },
    transform(code, id) {
      const s = new MagicString__default(code);
      if (id.endsWith("components.islands.mjs")) ; else {
        const strippedCode = stripLiteral.stripLiteral(code);
        if (!COMPOSABLE_RE.test(code)) {
          return;
        }
        for (const match of strippedCode.matchAll(COMPOSABLE_RE_GLOBAL)) {
          s.overwrite(match.index, match.index + match[0].length, `${match[1]} import.meta.prerender && ${match[2]}`);
        }
      }
      if (s.hasChanged()) {
        return {
          code: s.toString(),
          map: s.generateMap({ hires: true })
        };
      }
    }
  };
});

async function getNuxtModuleOptions(module, nuxt = kit.useNuxt()) {
  const moduleMeta = ({ name: module } ) || {};
  const { nuxtModule } = await kit.loadNuxtModuleInstance(module, nuxt);
  let moduleEntry;
  for (const m of nuxt.options.modules) {
    if (Array.isArray(m) && m.length >= 2) {
      const _module = m[0];
      const _moduleEntryName = typeof _module === "string" ? _module : (await _module.getMeta?.())?.name || "";
      if (_moduleEntryName === moduleMeta.name)
        moduleEntry = m;
    }
  }
  let inlineOptions = {};
  if (moduleEntry)
    inlineOptions = moduleEntry[1];
  if (nuxtModule.getOptions)
    return nuxtModule.getOptions(inlineOptions, nuxt);
  return inlineOptions;
}
function isNuxtGenerate(nuxt = kit.useNuxt()) {
  return nuxt.options._generate || nuxt.options.nitro.static || nuxt.options.nitro.preset === "static";
}

function normaliseFontInput(fonts) {
  return fonts.map((f) => {
    if (typeof f === "string") {
      const vals = f.split(":");
      const includesStyle = vals.length === 3;
      let name, weight, style;
      if (includesStyle) {
        name = vals[0];
        style = vals[1];
        weight = vals[2];
      } else {
        name = vals[0];
        weight = vals[1];
      }
      return {
        cacheKey: f,
        name,
        weight: weight || 400,
        style: style || "normal",
        path: void 0
      };
    }
    return {
      cacheKey: f.key || `${f.name}:${f.style}:${f.weight}`,
      style: "normal",
      weight: 400,
      ...f
    };
  });
}

const IS_MODULE_DEVELOPMENT = undefined.endsWith(".ts");
function isProviderEnabledForEnv(provider, nuxt, config) {
  return nuxt.options.dev && config.compatibility?.dev?.[provider] !== false || !nuxt.options.dev && (config.compatibility?.runtime?.[provider] !== false || config.compatibility?.prerender?.[provider] !== false);
}
const defaultComponentDirs = ["OgImage", "og-image", "OgImageTemplate"];
const module$1 = kit.defineNuxtModule({
  meta: {
    name: "nuxt-og-image",
    compatibility: {
      nuxt: ">=3.16.0"
    },
    configKey: "ogImage"
  },
  defaults() {
    return {
      enabled: true,
      defaults: {
        emojis: "noto",
        renderer: "satori",
        component: "NuxtSeo",
        extension: "png",
        width: 1200,
        height: 600,
        // default is to cache the image for 3 day (72 hours)
        cacheMaxAgeSeconds: 60 * 60 * 24 * 3
      },
      componentDirs: defaultComponentDirs,
      fonts: [],
      runtimeCacheStorage: true,
      debug: stdEnv.isDevelopment
    };
  },
  async setup(config, nuxt) {
    const resolver = kit.createResolver((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('module.cjs', document.baseURI).href)));
    const { resolve } = resolver;
    const { version } = await pkgTypes.readPackageJSON(resolve("../package.json"));
    const userAppPkgJson = await pkgTypes.readPackageJSON(nuxt.options.rootDir).catch(() => ({ dependencies: {}, devDependencies: {} }));
    logger_js.logger.level = config.debug || nuxt.options.debug ? 4 : 3;
    if (config.enabled === false) {
      logger_js.logger.debug("The module is disabled, skipping setup.");
      ["defineOgImage", "defineOgImageComponent", "defineOgImageScreenshot"].forEach((name) => {
        kit.addImports({ name, from: resolve(`./runtime/app/composables/mock`) });
      });
      return;
    }
    if (config.enabled && !nuxt.options.ssr) {
      logger_js.logger.warn("Nuxt OG Image is enabled but SSR is disabled.\n\nYou should enable SSR (`ssr: true`) or disable the module (`ogImage: { enabled: false }`).");
      return;
    }
    nuxt.options.alias["#og-image"] = resolve("./runtime");
    nuxt.options.alias["#og-image-cache"] = resolve("./runtime/server/og-image/cache/lru");
    nuxt.options.alias["#nuxt-og-image-utils"] = resolve("./runtime/shared");
    const preset = resolveNitroPreset(nuxt.options.nitro);
    const targetCompatibility = getPresetNitroPresetCompatibility(preset);
    if (config.zeroRuntime) {
      config.compatibility = defu.defu(config.compatibility, {
        runtime: {
          chromium: false,
          // should already be false
          satori: false
        }
      });
      if (!nuxt.options.dev) {
        kit.addBuildPlugin(TreeShakeComposablesPlugin, { server: true, client: true, build: true });
        nuxt.options.alias["#og-image-cache"] = resolve("./runtime/server/og-image/cache/mock");
      }
    }
    const basePath = config.zeroRuntime ? "./runtime/server/routes/__zero-runtime" : "./runtime/server/routes";
    let publicDirAbs = nuxt.options.dir.public;
    if (!pathe.isAbsolute(publicDirAbs)) {
      publicDirAbs = (publicDirAbs in nuxt.options.alias ? nuxt.options.alias[publicDirAbs] : resolve(nuxt.options.rootDir, publicDirAbs)) || "";
    }
    if (isProviderEnabledForEnv("satori", nuxt, config)) {
      let attemptSharpUsage = false;
      if (isProviderEnabledForEnv("sharp", nuxt, config)) {
        const userConfiguredExtension = config.defaults.extension;
        const hasConfiguredJpegs = userConfiguredExtension && ["jpeg", "jpg"].includes(userConfiguredExtension);
        const allDeps = {
          ...userAppPkgJson.dependencies || {},
          ...userAppPkgJson.devDependencies || {}
        };
        const hasExplicitSharpDependency = !!config.sharpOptions || "sharp" in allDeps || hasConfiguredJpegs && config.defaults.renderer !== "chromium";
        if (hasExplicitSharpDependency) {
          if (!targetCompatibility.sharp) {
            logger_js.logger.warn(`Rendering JPEGs requires sharp which does not work with ${preset}. Images will be rendered as PNG at runtime.`);
            config.compatibility = defu.defu(config.compatibility, {
              runtime: { sharp: false }
            });
          } else {
            await import('sharp').catch(() => {
            }).then(() => {
              attemptSharpUsage = true;
            });
          }
        } else if (hasConfiguredJpegs && config.defaults.renderer !== "chromium") {
          logger_js.logger.warn("You have enabled `JPEG` images. These require the `sharp` dependency which is missing, installing it for you.");
          await ensureDependencies(["sharp"]);
          logger_js.logger.warn("Support for `sharp` is limited so check the compatibility guide.");
          attemptSharpUsage = true;
        }
      }
      if (!attemptSharpUsage) {
        config.compatibility = defu.defu(config.compatibility, {
          runtime: { sharp: false },
          dev: { sharp: false },
          prerender: { sharp: false }
        });
      }
      if (isProviderEnabledForEnv("resvg", nuxt, config)) {
        await import('@resvg/resvg-js').catch(() => {
          logger_js.logger.warn("ReSVG is missing dependencies for environment. Falling back to WASM version, this may slow down PNG rendering.");
          config.compatibility = defu.defu(config.compatibility, {
            dev: { resvg: "wasm-fs" },
            prerender: { resvg: "wasm-fs" }
          });
          if (targetCompatibility.resvg === "node") {
            config.compatibility = defu.defu(config.compatibility, {
              runtime: { resvg: "wasm" }
            });
          }
        });
      }
      if (!config.fonts.length) {
        config.fonts = [
          {
            name: "Inter",
            weight: 400,
            path: resolve("./runtime/assets/Inter-normal-400.ttf.base64"),
            absolutePath: true
          },
          {
            name: "Inter",
            weight: 700,
            path: resolve("./runtime/assets/Inter-normal-700.ttf.base64"),
            absolutePath: true
          }
        ];
      }
      const serverFontsDir = resolve(nuxt.options.buildDir, "cache", `nuxt-og-image`, "_fonts");
      const fontStorage = unstorage.createStorage({
        driver: fsDriver__default({
          base: serverFontsDir
        })
      });
      config.fonts = (await Promise.all(normaliseFontInput(config.fonts).map(async (f) => {
        const fontKey = `${f.name}:${f.style}:${f.weight}`;
        const fontFileBase = fontKey.replaceAll(":", "-");
        if (!f.key && !f.path) {
          if (preset === "stackblitz") {
            logger_js.logger.warn(`The ${fontKey} font was skipped because remote fonts are not available in StackBlitz, please use a local font.`);
            return false;
          }
          const result = await downloadFont(f, fontStorage, config.googleFontMirror);
          if (result.success) {
            f.key = `nuxt-og-image:fonts:${fontFileBase}.ttf.base64`;
          } else {
            const mirrorMsg = config.googleFontMirror ? `using mirror host \`${result.host}\`` : "Consider setting `googleFontMirror: true` if you are in China or behind a firewall.";
            logger_js.logger.warn(`Failed to download font ${fontKey} ${mirrorMsg}`);
            if (result.error)
              logger_js.logger.warn(`  Error: ${result.error.message || result.error}`);
            return false;
          }
        } else if (f.path) {
          const extension = pathe.basename(f.path.replace(".base64", "")).split(".").pop();
          if (!["woff", "ttf", "otf"].includes(extension)) {
            logger_js.logger.warn(`The ${fontKey} font was skipped because the file extension ${extension} is not supported. Only woff, ttf and otf are supported.`);
            return false;
          }
          if (!f.absolutePath)
            f.path = resolve(publicDirAbs, ufo.withoutLeadingSlash(f.path));
          if (!fs.existsSync(f.path)) {
            logger_js.logger.warn(`The ${fontKey} font was skipped because the file does not exist at path ${f.path}.`);
            return false;
          }
          const fontData = await promises.readFile(f.path, f.path.endsWith(".base64") ? "utf-8" : "base64");
          f.key = `nuxt-og-image:fonts:${fontFileBase}.${extension}.base64`;
          await fontStorage.setItem(`${fontFileBase}.${extension}.base64`, fontData);
          delete f.path;
          delete f.absolutePath;
        }
        return f;
      }))).filter(Boolean);
      const fontKeys = config.fonts.map((f) => f.key?.split(":").pop());
      const fontStorageKeys = await fontStorage.getKeys();
      await Promise.all(fontStorageKeys.filter((key) => !fontKeys.includes(key)).map(async (key) => {
        logger_js.logger.info(`Nuxt OG Image removing outdated cached font file \`${key}\``);
        await fontStorage.removeItem(key);
      }));
      if (!config.zeroRuntime) {
        nuxt.options.nitro.serverAssets = nuxt.options.nitro.serverAssets || [];
        nuxt.options.nitro.serverAssets.push({ baseName: "nuxt-og-image:fonts", dir: serverFontsDir });
      }
      kit.addServerHandler({
        lazy: true,
        route: "/__og-image__/font/**",
        handler: resolve(`${basePath}/font`)
      });
    }
    if (isProviderEnabledForEnv("chromium", nuxt, config)) {
      const hasChromeLocally = checkLocalChrome();
      const hasPlaywrightDependency = await hasResolvableDependency("playwright");
      const chromeCompatibilityFlags = {
        prerender: config.compatibility?.prerender?.chromium,
        dev: config.compatibility?.dev?.chromium,
        runtime: config.compatibility?.runtime?.chromium
      };
      const chromiumBinding = {
        dev: null,
        prerender: null,
        runtime: null
      };
      if (nuxt.options.dev) {
        if (isUndefinedOrTruthy(chromeCompatibilityFlags.dev))
          chromiumBinding.dev = hasChromeLocally ? "chrome-launcher" : hasPlaywrightDependency ? "playwright" : "on-demand";
      } else {
        if (isUndefinedOrTruthy(chromeCompatibilityFlags.prerender))
          chromiumBinding.prerender = hasChromeLocally ? "chrome-launcher" : hasPlaywrightDependency ? "playwright" : "on-demand";
        if (isUndefinedOrTruthy(chromeCompatibilityFlags.runtime))
          chromiumBinding.runtime = hasPlaywrightDependency ? "playwright" : null;
      }
      config.compatibility = defu.defu(config.compatibility, {
        runtime: { chromium: chromiumBinding.runtime },
        dev: { chromium: chromiumBinding.dev },
        prerender: { chromium: chromiumBinding.prerender }
      });
    }
    await kit$1.installNuxtSiteConfig();
    const usingNuxtContent = kit.hasNuxtModule("@nuxt/content");
    const isNuxtContentV3 = usingNuxtContent && await kit.hasNuxtModuleCompatibility("@nuxt/content", "^3");
    const isNuxtContentV2 = usingNuxtContent && await kit.hasNuxtModuleCompatibility("@nuxt/content", "^2");
    if (isNuxtContentV3) {
      if (typeof config.strictNuxtContentPaths !== "undefined") {
        logger_js.logger.warn("The `strictNuxtContentPaths` option is deprecated and has no effect in Nuxt Content v3.");
      }
    } else if (isNuxtContentV2) {
      kit.addServerPlugin(resolve("./runtime/server/plugins/nuxt-content-v2"));
    }
    nuxt.options.experimental.componentIslands ||= true;
    if (config.debug || nuxt.options.dev) {
      kit.addServerHandler({
        lazy: true,
        route: "/__og-image__/debug.json",
        handler: resolve("./runtime/server/routes/debug.json")
      });
    }
    kit.addServerHandler({
      lazy: true,
      route: "/__og-image__/image/**",
      handler: resolve(`${basePath}/image`)
    });
    kit.addServerHandler({
      lazy: true,
      route: "/__og-image__/static/**",
      handler: resolve(`${basePath}/image`)
    });
    if (!nuxt.options.dev) {
      nuxt.options.optimization.treeShake.composables.client["nuxt-og-image"] = [];
    }
    [
      "defineOgImage",
      "defineOgImageComponent",
      { name: "defineOgImageScreenshot", enabled: isProviderEnabledForEnv("chromium", nuxt, config) }
    ].forEach((name) => {
      if (typeof name === "object") {
        if (!name.enabled) {
          kit.addImports({ name: name.name, from: resolve(`./runtime/app/composables/mock`) });
          return;
        }
        name = name.name;
      }
      kit.addImports({
        name,
        from: resolve(`./runtime/app/composables/${name}`)
      });
      if (!nuxt.options.dev) {
        nuxt.options.optimization.treeShake.composables.client = nuxt.options.optimization.treeShake.composables.client || {};
        nuxt.options.optimization.treeShake.composables.client["nuxt-og-image"] = nuxt.options.optimization.treeShake.composables.client["nuxt-og-image"] || [];
        nuxt.options.optimization.treeShake.composables.client["nuxt-og-image"].push(name);
      }
    });
    if (!config.zeroRuntime || nuxt.options.dev) {
      kit.addComponentsDir({
        path: resolve("./runtime/app/components/Templates/Community"),
        island: true,
        watch: IS_MODULE_DEVELOPMENT
      });
    }
    [
      // new
      "OgImage",
      "OgImageScreenshot"
    ].forEach((name) => {
      kit.addComponent({
        name,
        filePath: resolve(`./runtime/app/components/OgImage/${name}`),
        ...config.componentOptions
      });
    });
    const basePluginPath = `./runtime/app/plugins${config.zeroRuntime ? "/__zero-runtime" : ""}`;
    kit.addPlugin({ mode: "server", src: resolve(`${basePluginPath}/route-rule-og-image.server`) });
    kit.addPlugin({ mode: "server", src: resolve(`${basePluginPath}/og-image-canonical-urls.server`) });
    for (const componentDir of config.componentDirs) {
      const path = resolve(nuxt.options.srcDir, "components", componentDir);
      if (fs.existsSync(path)) {
        kit.addComponentsDir({
          path,
          island: true,
          watch: IS_MODULE_DEVELOPMENT
        });
      } else if (!defaultComponentDirs.includes(componentDir)) {
        logger_js.logger.warn(`The configured component directory \`./${pathe.relative(nuxt.options.rootDir, path)}\` does not exist. Skipping.`);
      }
    }
    const ogImageComponentCtx = { components: [] };
    nuxt.hook("components:extend", (components) => {
      ogImageComponentCtx.components = [];
      components.forEach((component) => {
        let valid = false;
        config.componentDirs.forEach((dir) => {
          if (component.pascalName.startsWith(dir) || component.kebabName.startsWith(dir) || component.shortPath.includes(`/${dir}/`)) {
            valid = true;
          }
        });
        if (component.filePath.includes(resolve("./runtime/app/components/Templates")))
          valid = true;
        if (valid && fs__namespace.existsSync(component.filePath)) {
          component.island = true;
          component.mode = "server";
          let category = "app";
          if (component.filePath.includes(resolve("./runtime/app/components/Templates/Community")))
            category = "community";
          const componentFile = fs__namespace.readFileSync(component.filePath, "utf-8");
          const credits = componentFile.split("\n").find((line) => line.startsWith(" * @credits"))?.replace("* @credits", "").trim();
          ogImageComponentCtx.components.push({
            // purge cache when component changes
            hash: ohash.hash(componentFile).replaceAll("_", "-"),
            pascalName: component.pascalName,
            kebabName: component.kebabName,
            path: component.filePath,
            category,
            credits
          });
        }
      });
      nuxt.hooks.hook("nuxt-og-image:components", ogImageComponentCtx);
    });
    kit.addTemplate({
      filename: "nuxt-og-image/components.mjs",
      getContents() {
        return `export const componentNames = ${JSON.stringify(ogImageComponentCtx.components)}`;
      },
      options: { mode: "server" }
    });
    nuxt.options.nitro.virtual = nuxt.options.nitro.virtual || {};
    nuxt.options.nitro.virtual["#og-image-virtual/component-names.mjs"] = () => {
      return `export const componentNames = ${JSON.stringify(ogImageComponentCtx.components)}`;
    };
    let unoCssConfig = {};
    nuxt.hook("tailwindcss:config", (tailwindConfig) => {
      unoCssConfig = defu.defu(tailwindConfig.theme?.extend, { ...tailwindConfig.theme, extend: void 0 });
    });
    nuxt.hook("unocss:config", (_unoCssConfig) => {
      unoCssConfig = { ..._unoCssConfig.theme };
    });
    nuxt.options.nitro.virtual["#og-image-virtual/unocss-config.mjs"] = () => {
      return `export const theme = ${JSON.stringify(unoCssConfig)}`;
    };
    kit.addTypeTemplate({
      filename: "module/nuxt-og-image.d.ts",
      getContents: (data) => {
        const typesPath = pathe.relative(resolve(data.nuxt.options.rootDir, data.nuxt.options.buildDir, "module"), resolve("runtime/types"));
        const componentImports = ogImageComponentCtx.components.map((component) => {
          const relativeComponentPath = pathe.relative(resolve(nuxt.options.rootDir, nuxt.options.buildDir, "module"), component.path);
          const name = config.componentDirs.sort((a, b) => b.length - a.length).reduce((name2, dir) => {
            return name2.replace(new RegExp(`^${dir}`), "");
          }, component.pascalName);
          return `    '${name}': typeof import('${relativeComponentPath}')['default']`;
        }).join("\n");
        const types = `interface NitroRouteRules {
    ogImage?: false | import('${typesPath}').OgImageOptions & Record<string, any>
  }
  interface NitroRouteConfig {
    ogImage?: false | import('${typesPath}').OgImageOptions & Record<string, any>
  }
  interface NitroRuntimeHooks {
    'nuxt-og-image:context': (ctx: import('${typesPath}').OgImageRenderEventContext) => void | Promise<void>
    'nuxt-og-image:satori:vnodes': (vnodes: import('${typesPath}').VNode, ctx: import('${typesPath}').OgImageRenderEventContext) => void | Promise<void>
  }`;
        return `
declare module 'nitropack' {
${types}
}

declare module 'nitropack/types' {
${types}
}

declare module '#og-image/components' {
  export interface OgImageComponents {
${componentImports}
  }
}
declare module '#og-image/unocss-config' {
  export type theme = any
}

export {}
`;
      }
    }, {
      nitro: true,
      nuxt: true
    });
    const cacheEnabled = typeof config.runtimeCacheStorage !== "undefined" && config.runtimeCacheStorage !== false;
    const runtimeCacheStorage = typeof config.runtimeCacheStorage === "boolean" ? "default" : config.runtimeCacheStorage.driver;
    let baseCacheKey = runtimeCacheStorage === "default" ? `/cache/nuxt-og-image/${version}` : `/nuxt-og-image/${version}`;
    if (!cacheEnabled)
      baseCacheKey = false;
    if (!nuxt.options.dev && config.runtimeCacheStorage && typeof config.runtimeCacheStorage === "object") {
      nuxt.options.nitro.storage = nuxt.options.nitro.storage || {};
      nuxt.options.nitro.storage["nuxt-og-image"] = config.runtimeCacheStorage;
    }
    nuxt.hooks.hook("modules:done", async () => {
      const normalisedFonts = normaliseFontInput(config.fonts);
      if (!isNuxtGenerate() && nuxt.options.build) {
        nuxt.options.nitro = nuxt.options.nitro || {};
        nuxt.options.nitro.prerender = nuxt.options.nitro.prerender || {};
        nuxt.options.nitro.prerender.routes = nuxt.options.nitro.prerender.routes || [];
      }
      const hasColorModeModule = kit.hasNuxtModule("@nuxtjs/color-mode");
      const colorModeOptions = hasColorModeModule ? await getNuxtModuleOptions("@nuxtjs/color-mode") : {};
      let colorPreference = colorModeOptions.preference;
      if (!colorPreference || colorPreference === "system")
        colorPreference = colorModeOptions.fallback;
      if (!colorPreference || colorPreference === "system")
        colorPreference = "light";
      const runtimeConfig = {
        version,
        // binding options
        satoriOptions: config.satoriOptions || {},
        resvgOptions: config.resvgOptions || {},
        sharpOptions: config.sharpOptions === true ? {} : config.sharpOptions || {},
        publicStoragePath: `root${publicDirAbs.replace(nuxt.options.rootDir, "").replaceAll("/", ":")}`,
        defaults: config.defaults,
        debug: config.debug,
        // avoid adding credentials
        baseCacheKey,
        // convert the fonts to uniform type to fix ts issue
        fonts: normalisedFonts,
        hasNuxtIcon: kit.hasNuxtModule("nuxt-icon") || kit.hasNuxtModule("@nuxt/icon"),
        colorPreference,
        strictNuxtContentPaths: config.strictNuxtContentPaths,
        // @ts-expect-error runtime type
        isNuxtContentDocumentDriven: config.strictNuxtContentPaths || !!nuxt.options.content?.documentDriven
      };
      if (nuxt.options.dev) {
        runtimeConfig.componentDirs = config.componentDirs;
      }
      nuxt.hooks.callHook("nuxt-og-image:runtime-config", runtimeConfig);
      nuxt.options.runtimeConfig["nuxt-og-image"] = runtimeConfig;
    });
    if (nuxt.options.dev) {
      setupDevHandler(config, resolver);
      setupDevToolsUI(config, resolve);
    } else if (isNuxtGenerate()) {
      setupGenerateHandler(config, resolver);
    } else if (nuxt.options.build) {
      await setupBuildHandler(config, resolver);
    }
    if (nuxt.options.build)
      kit.addServerPlugin(resolve("./runtime/server/plugins/prerender"));
    setupPrerenderHandler(config, resolver);
  }
});

module.exports = module$1;
