import type { H3Event } from 'h3';
import type { NitroRouteRules } from 'nitropack';
import type { NuxtIslandResponse } from 'nuxt/app';
export declare function fetchIsland(e: H3Event, component: string, props: Record<string, any>): Promise<NuxtIslandResponse>;
export declare function withoutQuery(path: string): string | undefined;
export declare function createNitroRouteRuleMatcher(): ((path: string) => NitroRouteRules);
