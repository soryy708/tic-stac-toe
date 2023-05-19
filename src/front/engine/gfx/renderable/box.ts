import { BoxGeometry, MeshLambertMaterial, Mesh, Vector3 } from 'three';
import { Vector } from '../../math/vector';
import { RendererContext } from '../context';
import { Renderable } from './interface';
import { VectorInternalAdapter } from '../../math/vector-internal-adapter';

type Dimensions = {
    width: number;
    height: number;
    depth: number;
};

export class Box implements Renderable {
    private mesh: Mesh;
    private material = new MeshLambertMaterial({ color: 0xffffff });

    constructor(dimensions: Dimensions) {
        const geometry = new BoxGeometry(
            dimensions.width,
            dimensions.height,
            dimensions.depth,
        );
        this.mesh = new Mesh(geometry, this.material);
    }

    registerRenderer(context: RendererContext): void {
        context.scene.getInternal().add(this.mesh);
    }

    rotate(vector: Vector<[number, number, number]>): void {
        this.mesh.rotation.x += vector.get(0);
        this.mesh.rotation.y += vector.get(1);
        this.mesh.rotation.z += vector.get(2);
    }

    setColor(rgb: { r: number; g: number; b: number }): void {
        this.material.setValues({
            color: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        });
    }

    setPosition(position: Vector<[number, number, number]>): void {
        this.mesh.position.set(
            position.get(0),
            position.get(1),
            position.get(2),
        );
    }

    getInternalMesh(): Mesh {
        return this.mesh;
    }

    getWorldCoordinates(): Vector<[number, number, number]> {
        const vector3 = new Vector3();
        return VectorInternalAdapter.toVector(
            this.mesh.getWorldPosition(vector3),
        );
    }

    hide(): void {
        this.mesh.visible = false;
    }

    show(): void {
        this.mesh.visible = true;
    }
}
