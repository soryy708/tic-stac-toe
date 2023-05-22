import { Engine } from '../../engine';
import { Torus } from '../../engine/gfx/renderable/torus';
import { Vector } from '../../engine/math/vector';
import { BoardPosition } from '../board/abstract-board';
import { GamePiece } from './interface';

const cellSize = 4;
const boardLength = cellSize * 4;
const torusWidth = 0.5;
const zDistance = 2;

export class Nought implements GamePiece {
    private ring: Torus;

    constructor(
        private boardPosition: {
            x: BoardPosition;
            y: BoardPosition;
            z: BoardPosition;
        },
    ) {
        this.ring = new Torus({
            radius: cellSize / 2 - torusWidth,
            width: torusWidth,
        });
        this.ring.setColor({ r: 0, g: 0, b: 255 });
        this.ring.setPosition(
            new Vector<[number, number, number]>(
                cellSize * this.boardPosition.x - boardLength / 2,
                cellSize * this.boardPosition.y - boardLength / 2,
                zDistance * this.boardPosition.z -
                    boardLength / 2 +
                    torusWidth * 2,
            ),
        );
    }

    bootstrap(engine: Engine): void {
        this.ring.registerRenderer(engine.getRendererContext());
    }

    isSameTypeAs(other: GamePiece): boolean {
        return other instanceof Nought;
    }
}
