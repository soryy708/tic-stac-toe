import { Renderer } from './renderer';
import { GraphicsScene } from './scene';

export type RendererContext = {
    scene: GraphicsScene;
    renderer: Renderer;
};
