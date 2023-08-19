import { AbstractBoard, BoardPosition } from '../board/abstract-board';
import { GamePiece } from '../piece/interface';
import { WinChecker } from '../win';

export class Evaluator {
    public evaluate(
        board: AbstractBoard,
        move: { x: BoardPosition; y: BoardPosition },
        identity: GamePiece,
        opponent: GamePiece,
    ): number {
        if (this.weWillWin(board, move, identity)) {
            return 1;
        }
        if (this.weWillLose(board, move, opponent)) {
            return 0.5;
        }
        return 0;
    }

    private weWillLose(
        board: AbstractBoard,
        move: { x: BoardPosition; y: BoardPosition },
        opponent: GamePiece,
    ): boolean {
        const boardAfterOpponentMoves = board.clone();
        boardAfterOpponentMoves.stack(move, opponent);
        const winChecker = new WinChecker(boardAfterOpponentMoves);
        const winner = winChecker.getWinner();
        return winner && winner.isSameTypeAs(opponent);
    }

    private weWillWin(
        board: AbstractBoard,
        move: { x: BoardPosition; y: BoardPosition },
        identity: GamePiece,
    ): boolean {
        const boardAfterWeMove = board.clone();
        boardAfterWeMove.stack(move, identity);
        const winChecker = new WinChecker(boardAfterWeMove);
        const winner = winChecker.getWinner();
        return winner && winner.isSameTypeAs(identity);
    }
}
