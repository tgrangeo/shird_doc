import type { H3Event } from 'h3';
import type { GetSiteConfigOptions } from 'site-config-stack';
import type { NuxtSiteConfig } from '../../types.js';
/**
 * @deprecated please use getSiteConfig instead
 */
export declare function useSiteConfig(e: H3Event, _options?: GetSiteConfigOptions): NuxtSiteConfig;
