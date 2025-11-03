declare const _default: {
    initWasmPromise: Promise<void>;
    Resvg: new (svg: Uint8Array | string, options?: import("@resvg/resvg-wasm").ResvgRenderOptions) => {
        free(): void;
        render(): {
            free(): void;
            asPng(): Uint8Array;
            readonly height: number;
            readonly pixels: Uint8Array;
            readonly width: number;
        };
        toString(): string;
        innerBBox(): {
            free(): void;
            height: number;
            width: number;
            x: number;
            y: number;
        } | undefined;
        getBBox(): {
            free(): void;
            height: number;
            width: number;
            x: number;
            y: number;
        } | undefined;
        cropByBBox(bbox: {
            free(): void;
            height: number;
            width: number;
            x: number;
            y: number;
        }): void;
        imagesToResolve(): any[];
        resolveImage(href: string, buffer: Uint8Array): void;
        readonly height: number;
        readonly width: number;
    };
};
export default _default;
