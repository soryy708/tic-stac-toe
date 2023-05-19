import { Object3D } from 'three';
import { Engine } from '../../engine';
import { Box } from '../../engine/gfx/renderable/box';
import { Group } from '../../engine/gfx/renderable/group';
import { Raycaster } from '../../engine/io/raycaster';
import { Vector } from '../../engine/math/vector';
import { AbstractBoard, BoardPosition } from './abstract-board';

type HoverObserver = (position: { x: BoardPosition; y: BoardPosition }) => void;
type LeaveObserver = () => void;

const boardLineCardinality = 4;
const cellSize = 4;

/**
 * Game board, with rendering and UI capabilities
 */
export class Board extends AbstractBoard {
    private group = new Group();
    private hoverObservers: HoverObserver[] = [];
    private leaveObservers: LeaveObserver[] = [];
    private notifiedLeaveObservers = true;

    constructor(private raycaster: Raycaster) {
        super();

        for (let y = 0; y < boardLineCardinality; ++y) {
            for (let x = 0; x < boardLineCardinality; ++x) {
                const box = new Box({
                    width: cellSize,
                    height: cellSize,
                    depth: 0,
                });

                const black = { r: 32, g: 32, b: 32 };
                const white = { r: 223, g: 223, b: 223 };
                const color = (x + y * 3) % 2 === 0 ? black : white;
                box.setColor(color);

                const position = this.getCellLocalCoordinates({
                    x: x as never,
                    y: y as never,
                });
                box.setPosition(position);

                this.group.add(box);
            }
        }
    }

    bootstrap(engine: Engine) {
        const boardDimension = this.getBoardDimension();
        this.group.registerRenderer(engine.getRendererContext());
        this.group.translate(
            new Vector(
                boardDimension / -2,
                boardDimension / -2,
                -boardDimension / 2,
            ),
        );
    }

    rotate(rotation: Vector<[number, number, number]>): void {
        this.group.addRotation(rotation);
    }

    tick(): void {
        const intersects = this.raycaster.getIntersectingObjects(
            this.group.getInternal(),
        );
        if (intersects.length > 0) {
            const first = intersects[0];
            const position = this.getObjectBoardPosition(first.object);
            if (position !== null) {
                this.notifiedLeaveObservers = false;
                this.hoverObservers.forEach((observer) => observer(position));
            }
        } else {
            if (!this.notifiedLeaveObservers) {
                this.notifiedLeaveObservers = true;
                this.leaveObservers.forEach((observer) => observer());
            }
        }
    }

    getCenter(): Vector<[number, number, number]> {
        const boardDimension = this.getBoardDimension();
        return this.group
            .getPosition()
            .addVector(new Vector(boardDimension / 2, boardDimension / 2, 0));
    }

    onHover(observer: HoverObserver): void {
        this.hoverObservers.push(observer);
    }

    onLeave(observer: LeaveObserver): void {
        this.leaveObservers.push(observer);
    }

    getCellWorldCoordinates({
        x,
        y,
    }: {
        x: BoardPosition;
        y: BoardPosition;
    }): Vector<[number, number, number]> {
        const index = x + y * 4;
        const renderable = this.group.getAt(index);
        return renderable.getWorldCoordinates();
    }

    private getCellLocalCoordinates({
        x,
        y,
    }: {
        x: BoardPosition;
        y: BoardPosition;
    }): Vector<[number, number, number]> {
        return new Vector(x * cellSize, y * cellSize, 0);
    }

    private getBoardDimension(): number {
        return boardLineCardinality * cellSize;
    }

    private getObjectBoardPosition(object: Object3D): {
        x: BoardPosition;
        y: BoardPosition;
    } {
        const index = this.group.findIndexByInternal(object);
        if (index === -1) {
            return null;
        }
        return {
            x: (index % 4) as never,
            y: Math.floor(index / 4) as never,
        };
    }
}
