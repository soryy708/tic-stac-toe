import { BoardPosition } from '../board/abstract-board';
import { Board } from '../board/board';
import { GamePiece } from '../piece/interface';

export class AiSolver {
    constructor(private board: Board) {}

    solveNextTurn(_piece: GamePiece): { x: BoardPosition; y: BoardPosition } {
        const allValid = this.getAllValidPlays(this.board);
        return allValid[Math.floor(Math.random() * allValid.length)];
    }

    private getAllValidPlays(
        board: Board,
    ): Array<{ x: BoardPosition; y: BoardPosition }> {
        const zeroToThree = [0, 1, 2, 3];
        return zeroToThree
            .map((x) =>
                zeroToThree.map((y) => ({
                    x: x as BoardPosition,
                    y: y as BoardPosition,
                })),
            )
            .reduce((prev, cur) => [...prev, ...cur])
            .filter(({ x, y }) => board.canStack(x, y));
    }
}
