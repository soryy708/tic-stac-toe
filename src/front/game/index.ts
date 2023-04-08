import { Engine } from '../engine';
import { Box } from '../engine/gfx/renderable/box';
import { Vector } from '../engine/math/vector';

type Player = 'player1' | 'player2';

class Test {
    private renderable: Box = new Box({ width: 2, height: 2, depth: 2 });

    bootstrap(engine: Engine) {
        this.renderable.registerRenderer(engine.getRendererContext());
    }

    tick(deltaTime: number) {
        this.renderable.addRotation(
            new Vector(1 * deltaTime, 1 * deltaTime, 0),
        );
    }
}

export class Game {
    private currentPlayer: Player = 'player1';
    private test = new Test();

    constructor(private engine: Engine) {}

    bootstrap(): void {
        this.test.bootstrap(this.engine);
    }

    tick(deltaTime: number) {
        this.test.tick(deltaTime);
    }
}
