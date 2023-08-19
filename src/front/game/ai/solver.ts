import { BoardPosition } from '../board/abstract-board';
import { Board } from '../board/board';
import { GamePiece } from '../piece/interface';
import { Evaluator } from './evaluator';

export class AiSolver {
    private evaluator = new Evaluator();

    constructor(private board: Board) {}

    solveNextTurn(
        identity: GamePiece,
        opponent: GamePiece,
    ): { x: BoardPosition; y: BoardPosition } {
        const allValid = this.getAllValidPlays(this.board);
        const playValues = allValid.map((play) =>
            this.evaluator.evaluate(this.board, play, identity, opponent),
        );
        const maxValue = playValues.reduce(
            (prev, cur) => (cur >= prev ? cur : prev),
            -Infinity,
        );
        if (maxValue === 0) {
            return allValid[Math.floor(Math.random() * allValid.length)];
        }
        const maxValueIndex = playValues.findIndex((v) => v === maxValue);
        return allValid[maxValueIndex];
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
