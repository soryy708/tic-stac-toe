import { RendererContext } from '../context';

export interface Renderable {
    registerRenderer(context: RendererContext): void;
}
