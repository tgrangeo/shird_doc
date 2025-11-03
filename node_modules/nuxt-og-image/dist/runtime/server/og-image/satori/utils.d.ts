import type { OgImageRenderEventContext, SatoriTransformer, VNode } from '../../../types.js';
export declare function walkSatoriTree(e: OgImageRenderEventContext, node: VNode, plugins: (SatoriTransformer | SatoriTransformer[])[]): (void | Promise<void>)[];
export declare function defineSatoriTransformer(transformer: SatoriTransformer | SatoriTransformer[]): SatoriTransformer | SatoriTransformer[];
