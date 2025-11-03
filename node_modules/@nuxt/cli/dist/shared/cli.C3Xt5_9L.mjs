import { readFileSync } from 'node:fs';
import { colors } from 'consola/utils';
import { resolveModulePath } from 'exsolve';
import { t as tryResolveNuxt } from './cli.qKvs7FJ2.mjs';
import { l as logger } from './cli.B9AmABr3.mjs';

function showVersionsFromConfig(cwd, config) {
  const { bold, gray, green } = colors;
  function getBuilder() {
    switch (config.builder) {
      case "@nuxt/rspack-builder":
        return { name: "Rspack", version: getPkgVersion("@rspack/core") };
      case "@nuxt/webpack-builder":
        return { name: "Webpack", version: getPkgVersion("webpack") };
      case "@nuxt/vite-builder":
      default: {
        const pkgJSON = getPkgJSON("vite");
        const isRolldown = pkgJSON.name.includes("rolldown");
        return { name: isRolldown ? "Rolldown-Vite" : "Vite", version: pkgJSON.version };
      }
    }
  }
  function getPkgJSON(pkg) {
    for (const url of [cwd, tryResolveNuxt(cwd)]) {
      if (!url) {
        continue;
      }
      const p = resolveModulePath(`${pkg}/package.json`, { from: url, try: true });
      if (p) {
        return JSON.parse(readFileSync(p, "utf-8"));
      }
    }
    return null;
  }
  function getPkgVersion(pkg) {
    const pkgJSON = getPkgJSON(pkg);
    return pkgJSON?.version ?? "";
  }
  const nuxtVersion = getPkgVersion("nuxt") || getPkgVersion("nuxt-nightly") || getPkgVersion("nuxt3") || getPkgVersion("nuxt-edge");
  const nitroVersion = getPkgVersion("nitropack") || getPkgVersion("nitropack-nightly") || getPkgVersion("nitropack-edge");
  const builder = getBuilder();
  const vueVersion = getPkgVersion("vue") || null;
  logger.log(
    green(`Nuxt ${bold(nuxtVersion)}`) + gray(" (with ") + (nitroVersion ? gray(`Nitro ${bold(nitroVersion)}`) : "") + gray(`, ${builder.name} ${bold(builder.version)}`) + (vueVersion ? gray(` and Vue ${bold(vueVersion)}`) : "") + gray(")")
  );
}
async function showVersions(cwd, kit) {
  const config = await kit.loadNuxtConfig({ cwd });
  return showVersionsFromConfig(cwd, config);
}

export { showVersionsFromConfig as a, showVersions as s };
