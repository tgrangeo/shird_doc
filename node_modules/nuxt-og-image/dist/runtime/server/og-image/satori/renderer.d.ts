import type { OgImageRenderEventContext, Renderer } from '../../../types.js';
export declare function createSvg(event: OgImageRenderEventContext): Promise<string | void>;
declare const SatoriRenderer: Renderer;
export default SatoriRenderer;
