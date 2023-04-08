import { Scene as ThreeScene } from 'three';

export class GraphicsScene {
    private threeScene: ThreeScene = new ThreeScene();

    getInternal() {
        return this.threeScene;
    }
}
