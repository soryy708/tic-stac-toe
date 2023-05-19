import { Object3D, Group as ThreeGroup } from 'three';
import { Renderable } from './interface';
import { RendererContext } from '../context';
import { Vector } from '../../math/vector';
import { VectorInternalAdapter } from '../../math/vector-internal-adapter';

export class Group {
    private group = new ThreeGroup();
    private renderables: Renderable[] = [];

    registerRenderer(context: RendererContext): void {
        context.scene.getInternal().add(this.group);
    }

    add(renderable: Renderable): void {
        this.group.add(renderable.getInternalMesh());
        this.renderables.push(renderable);
    }

    addRotation(vector: Vector<[number, number, number]>): void {
        this.group.rotation.x += vector.get(0);
        this.group.rotation.y += vector.get(1);
        this.group.rotation.z += vector.get(2);
    }

    translate(vector: Vector<[number, number, number]>): void {
        this.group.position.add(VectorInternalAdapter.toThree3(vector));
    }

    getPosition(): Vector<[number, number, number]> {
        return VectorInternalAdapter.toVector(this.group.position);
    }

    getInternal(): ThreeGroup {
        return this.group;
    }

    findIndexByInternal(object: Object3D): number {
        return this.group.children.findIndex((o) => o === object);
    }

    getAt(index: number): Renderable {
        return this.renderables[index];
    }
}
