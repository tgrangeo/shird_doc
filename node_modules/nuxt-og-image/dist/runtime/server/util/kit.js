import { defu } from "defu";
import { useRuntimeConfig } from "nitropack/runtime";
import { hash } from "ohash";
import { createRouter as createRadixRouter, toRouteMatcher } from "radix3";
import { withoutBase, withoutTrailingSlash } from "ufo";
export function fetchIsland(e, component, props) {
  const hashId = hash([component, props]).replaceAll("_", "-");
  return e.$fetch(`/__nuxt_island/${component}_${hashId}.json`, {
    params: {
      props: JSON.stringify(props)
    }
  });
}
export function withoutQuery(path) {
  return path.split("?")[0];
}
export function createNitroRouteRuleMatcher() {
  const { nitro, app } = useRuntimeConfig();
  const _routeRulesMatcher = toRouteMatcher(
    createRadixRouter({
      routes: Object.fromEntries(
        Object.entries(nitro?.routeRules || {}).map(([path, rules]) => [withoutTrailingSlash(path), rules])
      )
    })
  );
  return (path) => {
    return defu({}, ..._routeRulesMatcher.matchAll(
      // radix3 does not support trailing slashes
      withoutBase(withoutTrailingSlash(withoutQuery(path)), app.baseURL)
    ).reverse());
  };
}
