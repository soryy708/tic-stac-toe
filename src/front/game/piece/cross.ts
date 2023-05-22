import { Engine } from '../../engine';
import { Box } from '../../engine/gfx/renderable/box';
import { Group } from '../../engine/gfx/renderable/group';
import { Vector } from '../../engine/math/vector';
import { BoardPosition } from '../board/abstract-board';
import { GamePiece } from './interface';

const cellSize = 4;
const boardLength = cellSize * 4;
const crossDepth = 1;
const zDistance = 2;

export class Cross implements GamePiece {
    private group = new Group();

    constructor(
        private boardPosition: {
            x: BoardPosition;
            y: BoardPosition;
            z: BoardPosition;
        },
    ) {
        const color = { r: 255, g: 0, b: 0 };

        const box1 = new Box({ width: 1, height: cellSize, depth: crossDepth });
        box1.rotate(new Vector(0, 0, 1));
        box1.setColor(color);
        this.group.add(box1);

        const box2 = new Box({ width: 1, height: cellSize, depth: crossDepth });
        box2.rotate(new Vector(0, 0, -1));
        box2.setColor(color);
        this.group.add(box2);

        this.group.translate(
            new Vector(
                cellSize * this.boardPosition.x - boardLength / 2,
                cellSize * this.boardPosition.y - boardLength / 2,
                zDistance * this.boardPosition.z - boardLength / 2 + crossDepth,
            ),
        );
    }

    bootstrap(engine: Engine): void {
        this.group.registerRenderer(engine.getRendererContext());
    }

    destroy() {
        this.group.destroy();
    }

    isSameTypeAs(other: GamePiece): boolean {
        return other instanceof Cross;
    }
}
