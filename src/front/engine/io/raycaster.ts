import { Object3D, Raycaster as ThreeRaycaster } from 'three';
import { Engine } from '..';
import { Pointer } from './pointer';
import { VectorInternalAdapter } from '../math/vector-internal-adapter';

export class Raycaster {
    private raycaster = new ThreeRaycaster();

    constructor(private engine: Engine, private pointer: Pointer) {}

    tick(): void {
        const pointer = this.pointer.getNdcCoordinates();
        this.raycaster.setFromCamera(
            VectorInternalAdapter.toThree2(pointer),
            this.engine.getRendererContext().renderer.getInternalCamera(),
        );
    }

    getIntersectingObjects(
        subscene: Object3D,
    ): ReturnType<ThreeRaycaster['intersectObjects']> {
        return this.raycaster.intersectObjects(subscene.children);
    }
}
