import { GamePiece } from '../piece/interface';

type BoardCell = GamePiece | null;
type BoardRow = [BoardCell, BoardCell, BoardCell, BoardCell];
type BoardPlane = [BoardRow, BoardRow, BoardRow, BoardRow];
type BoardState = [BoardPlane, BoardPlane, BoardPlane, BoardPlane]; // 3D cube, 4x4x4

export type BoardPosition = 0 | 1 | 2 | 3;

/**
 * Game board, 4x4x4 matrix. Each vertical column is an append-only stack.
 * Headless, so it can be used without rendering, e.g. for AI.
 */
export class AbstractBoard {
    /**
     * Matrix [x][y][z]
     * [0][0] = bottom left of board
     * z = perpendicular to board
     */
    private state: BoardState = [
        [
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
        ],
        [
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
        ],
        [
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
        ],
        [
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
        ],
    ];

    canStack(x: BoardPosition, y: BoardPosition): boolean {
        const topOfColumnZ = 3;
        return this.getCell(x, y, topOfColumnZ) === null; // Each column is a stack, so there can't be gaps
    }

    stack(
        position: { x: BoardPosition; y: BoardPosition },
        piece: GamePiece,
    ): void {
        if (!this.canStack(position.x, position.y)) {
            throw new Error("Can't stack fully stacked column");
        }
        const z: BoardPosition = this.getStackHeight(position);
        this.setCell({ ...position, z }, piece);
    }

    getCell(x: BoardPosition, y: BoardPosition, z: BoardPosition): BoardCell {
        if (
            this.isOutOfBounds(x) ||
            this.isOutOfBounds(y) ||
            this.isOutOfBounds(z)
        ) {
            throw new Error(
                `Attempt to get cell at (${x},${y},${z}) out of bounds`,
            );
        }
        return this.state[x][y][z];
    }

    public getAllPieces(): Array<GamePiece> {
        return this.getStateAsFlat().filter((piece) => piece !== null);
    }

    public clear(): void {
        for (let x = 0; x < 4; ++x) {
            for (let y = 0; y < 4; ++y) {
                for (let z = 0; z < 4; ++z) {
                    this.state[x][y][z] = null;
                }
            }
        }
    }

    private isOutOfBounds(scalar: number): boolean {
        return scalar < 0 || scalar > 3;
    }

    public getStackHeight(position: {
        x: BoardPosition;
        y: BoardPosition;
    }): BoardPosition {
        const { height } = this.getHighest(position.x, position.y);
        return height;
    }

    public clone(): AbstractBoard {
        const newBoard = new AbstractBoard();
        for (let x = 0; x < 4; ++x) {
            for (let y = 0; y < 4; ++y) {
                for (let z = 0; z < 4; ++z) {
                    newBoard.state[x][y][z] = this.state[x][y][z];
                }
            }
        }
        return newBoard;
    }

    private setCell(
        position: { x: BoardPosition; y: BoardPosition; z: BoardPosition },
        content: BoardCell,
    ): void {
        if (this.state[position.x][position.y][position.z] !== null) {
            throw new Error('Tried to overwrite a non-empty cell');
        }
        this.state[position.x][position.y][position.z] = content;
    }

    private getHighest(
        x: BoardPosition,
        y: BoardPosition,
    ): { content: BoardCell; height: BoardPosition } {
        const column = this.state[x][y];
        const reversed = [...column].reverse();
        const index = reversed.findIndex((c) => c !== null);
        if (index === -1) {
            return { content: null, height: 0 };
        }
        return { content: reversed[index], height: (4 - index) as never };
    }

    private getStateAsFlat(): Array<GamePiece> {
        return this.state
            .reduce((prev, cur) => [...prev, ...cur] as never)
            .reduce((prev, cur) => [...prev, ...cur] as never);
    }
}
