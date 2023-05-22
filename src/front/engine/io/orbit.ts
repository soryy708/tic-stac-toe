import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Engine } from '..';
import { VectorInternalAdapter } from '../math/vector-internal-adapter';
import { Vector } from '../math/vector';

export class OrbitIo {
    private controls: OrbitControls;

    constructor(private engine: Engine) {
        const renderer = this.engine.getRendererContext().renderer;
        this.controls = new OrbitControls(
            renderer.getInternalCamera(),
            renderer.getInternal().domElement,
        );
        this.controls.update();
    }

    setTarget(v: Vector<[number, number, number]>): void {
        VectorInternalAdapter.setThree({
            target: this.controls.target,
            source: v,
        });
        this.controls.update();
    }
}
