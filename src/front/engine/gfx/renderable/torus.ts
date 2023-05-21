import {
    Mesh,
    MeshLambertMaterial,
    RingGeometry,
    TorusGeometry,
    Vector3,
} from 'three';
import { Renderable } from './interface';
import { RendererContext } from '../context';
import { Vector } from '../../math/vector';
import { VectorInternalAdapter } from '../../math/vector-internal-adapter';

type Dimensions = {
    radius: number;
    width: number;
};

export class Torus implements Renderable {
    private mesh: Mesh;
    private material = new MeshLambertMaterial({ color: 0xffffff });

    constructor(dimensions: Dimensions) {
        const geometry = new TorusGeometry(
            dimensions.radius,
            dimensions.width,
            8,
            24,
        );
        this.mesh = new Mesh(geometry, this.material);
    }

    registerRenderer(context: RendererContext): void {
        context.scene.getInternal().add(this.mesh);
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
}
