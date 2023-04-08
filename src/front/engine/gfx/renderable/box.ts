import { BoxGeometry, MeshLambertMaterial, Mesh } from 'three';
import { Vector } from '../../math/vector';
import { RendererContext } from '../context';
import { Renderable } from './interface';

type Dimensions = {
    width: number;
    height: number;
    depth: number;
};

export class Box implements Renderable {
    private mesh: Mesh;

    constructor(dimensions: Dimensions) {
        const geometry = new BoxGeometry(
            dimensions.width,
            dimensions.height,
            dimensions.depth,
        );
        const material = new MeshLambertMaterial({ color: 0xffffff });
        this.mesh = new Mesh(geometry, material);
    }

    registerRenderer(context: RendererContext): void {
        context.scene.getInternal().add(this.mesh);
    }

    addRotation(vector: Vector<[number, number, number]>): void {
        this.mesh.rotation.x += vector.get(0);
        this.mesh.rotation.y += vector.get(1);
        this.mesh.rotation.z += vector.get(2);
    }
}
