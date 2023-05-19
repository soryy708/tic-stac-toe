import { Mesh } from 'three';
import { RendererContext } from '../context';
import { Vector } from '../../math/vector';

export interface Renderable {
    registerRenderer(context: RendererContext): void;
    getInternalMesh(): Mesh;
    getWorldCoordinates(): Vector<[number, number, number]>;
}
