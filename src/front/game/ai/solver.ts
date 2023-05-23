import { BoardPosition } from '../board/abstract-board';
import { Board } from '../board/board';
import { GamePiece } from '../piece/interface';

export class AiSolver {
    constructor(private board: Board) {}

    solveNextTurn(_piece: GamePiece): { x: BoardPosition; y: BoardPosition } {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const randomX: BoardPosition = Math.floor(
                Math.random() * 4,
            ) as never;
            const randomY: BoardPosition = Math.floor(
                Math.random() * 4,
            ) as never;
            if (this.board.canStack(randomX, randomY)) {
                return { x: randomX, y: randomY };
            }
        }
    }
}
