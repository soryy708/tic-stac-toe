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
    private state: BoardState;

    canStack(x: BoardPosition, y: BoardPosition): boolean {
        const topOfColumnZ = 3;
        return this.getCell(x, y, topOfColumnZ) !== null; // Each column is a stack, so there can't be gaps
    }

    stack(
        position: { x: BoardPosition; y: BoardPosition },
        piece: GamePiece,
    ): void {
        if (!this.canStack(position.x, position.y)) {
            throw new Error("Can't stack fully stacked column");
        }
        const { content, height } = this.getHighest(position.x, position.y);
        const z: BoardPosition = (height + (content ? 1 : 0)) as never;
        this.setCell({ ...position, z }, piece);
    }

    getCell(x: BoardPosition, y: BoardPosition, z: BoardPosition): BoardCell {
        return this.state[y][x][z];
    }

    private setCell(
        position: { x: BoardPosition; y: BoardPosition; z: BoardPosition },
        content: BoardCell,
    ): void {
        if (this.state[position.y][position.x][position.z] !== null) {
            throw new Error('Tried to overwrite a non-empty cell');
        }
        this.state[position.y][position.x][position.z] = content;
    }

    private getHighest(
        x: BoardPosition,
        y: BoardPosition,
    ): { content: BoardCell; height: BoardPosition } {
        const column = this.state[y][x];
        const reversed = column.reverse();
        const index = reversed.findIndex((c) => c !== null);
        if (index === -1) {
            return { content: null, height: 0 };
        }
        return { content: reversed[index], height: (4 - index - 1) as never };
    }
}
