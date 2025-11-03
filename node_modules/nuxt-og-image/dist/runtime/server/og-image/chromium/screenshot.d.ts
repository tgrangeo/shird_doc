import type { Buffer } from 'node:buffer';
import type { Browser } from 'playwright-core';
import type { OgImageRenderEventContext } from '../../../types.js';
export declare function createScreenshot({ basePath, e, options, extension }: OgImageRenderEventContext, browser: Browser): Promise<Buffer>;
