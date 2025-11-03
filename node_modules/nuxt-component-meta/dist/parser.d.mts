import { ComponentMeta } from 'vue-component-meta';

interface Options {
    rootDir: string;
    cache?: boolean;
    cacheDir?: string;
}
declare function getComponentMeta(component: string, options?: Options): ComponentMeta;

export { getComponentMeta };
export type { Options };
