import { Vector3 } from 'three';
import { Engine } from '../engine';
import { Box } from '../engine/gfx/renderable/box';
import { OrbitIo } from '../engine/io/orbit';
import { Pointer } from '../engine/io/pointer';
import { Raycaster } from '../engine/io/raycaster';
import { Vector } from '../engine/math/vector';
import { VectorInternalAdapter } from '../engine/math/vector-internal-adapter';
import { BoardPosition } from './board/abstract-board';
import { Board } from './board/board';

const boardRotation: Vector<[number, number, number]> = new Vector(
    -0.75,
    -0.3,
    -0.01,
);

type Player = 'player1' | 'player2';

export class Game {
    private currentPlayer: Player = 'player1';
    private board: Board;
    private cursor = new Box({ width: 1, height: 1, depth: 1 });
    private orbitIo: OrbitIo;
    private raycaster: Raycaster;
    private pointer: Pointer;

    constructor(private engine: Engine) {}

    bootstrap(): void {
        this.pointer = new Pointer(this.engine.getRendererContext().canvas);
        this.raycaster = new Raycaster(this.engine, this.pointer);
        this.board = new Board(this.raycaster);
        this.board.onHover((position) => this.onBoardHover(position));
        this.board.onLeave(() => this.onBoardLeave());
        this.board.bootstrap(this.engine);
        this.board.rotate(boardRotation);
        this.cursor.setColor({ r: 255, g: 255, b: 0 });
        this.cursor.hide();
        this.cursor.rotate(boardRotation);
        this.cursor.registerRenderer(this.engine.getRendererContext());
        this.orbitIo = new OrbitIo(this.engine);
        this.orbitIo.setTarget(this.board.getCenter());
    }

    tick(_deltaTime: number) {
        this.raycaster.tick();
        this.board.tick();
    }

    private onBoardHover(position: {
        x: BoardPosition;
        y: BoardPosition;
    }): void {
        this.cursor.show();
        const coordinates = this.board.getCellWorldCoordinates(position);
        this.cursor.setPosition(coordinates);
    }

    private onBoardLeave() {
        this.cursor.hide();
    }
}
