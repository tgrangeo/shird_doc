import { createCheckerByJson } from 'vue-component-meta';
import { r as refineMeta } from './shared/nuxt-component-meta.CQ7Vskl2.mjs';
import { join, isAbsolute } from 'pathe';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { withBase } from 'ufo';
import { hash } from 'crypto';
import 'scule';

function getComponentMeta(component, options) {
  const rootDir = options?.rootDir ?? process.cwd();
  const opts = {
    cache: false,
    rootDir,
    cacheDir: join(rootDir, ".data/nuxt-component-meta"),
    ...options
  };
  const fullPath = isAbsolute(component) ? component : withBase(component, opts.rootDir);
  let cachePath = void 0;
  if (opts.cache) {
    try {
      const content = readFileSync(fullPath, { encoding: "utf8", flag: "r" });
      const cacheId = component.split("/").pop()?.replace(/\./g, "_") + "--" + hash("sha1", content).slice(0, 12);
      cachePath = join(opts.cacheDir, `${cacheId}.json`);
    } catch (error) {
      throw new Error(`Error reading file ${fullPath}: ${error}`);
    }
    if (existsSync(cachePath)) {
      return JSON.parse(readFileSync(cachePath, { encoding: "utf8", flag: "r" }));
    }
  }
  const componentMeta = _getComponentMeta(fullPath, opts);
  if (cachePath) {
    const cache = JSON.stringify({ cachedAt: Date.now(), ...componentMeta });
    if (!existsSync(opts.cacheDir)) {
      mkdirSync(opts.cacheDir, { recursive: true });
    }
    writeFileSync(cachePath, cache, { encoding: "utf8", flag: "w" });
  }
  return componentMeta;
}
function _getComponentMeta(fullPath, opts) {
  const isNodeModule = fullPath.includes("node_modules");
  let resolvedPath = fullPath;
  if (isNodeModule && fullPath.endsWith(".vue")) {
    const patterns = [
      fullPath.replace(".vue", ".d.vue.ts"),
      fullPath.replace(".vue", ".vue.d.ts"),
      fullPath.replace(".vue", ".d.ts")
    ];
    for (const pattern of patterns) {
      if (existsSync(pattern)) {
        resolvedPath = pattern;
        break;
      }
    }
  }
  const checker = createCheckerByJson(
    opts.rootDir,
    {
      extends: `${opts.rootDir}/tsconfig.json`,
      skipLibCheck: true,
      include: [resolvedPath],
      exclude: []
    }
  );
  return refineMeta(
    checker.getComponentMeta(resolvedPath)
  );
}

export { getComponentMeta };
