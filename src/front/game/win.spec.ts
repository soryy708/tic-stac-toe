import { AbstractBoard } from './board/abstract-board';
import { GamePiece } from './piece/interface';
import { WinChecker } from './win';

class TestPiece implements GamePiece {
    bootstrap() {
        // nop
    }

    destroy() {
        // nop
    }

    isSameTypeAs(other: GamePiece): boolean {
        return other instanceof TestPiece;
    }
}

class TestPiece2 implements GamePiece {
    bootstrap() {
        // nop
    }

    destroy() {
        // nop
    }

    isSameTypeAs(other: GamePiece): boolean {
        return other instanceof TestPiece2;
    }
}

describe('Win checker unit tests', () => {
    describe('When getting winner', () => {
        describe('When the board is empty', () => {
            it('Should return null', () => {
                const board = new AbstractBoard();
                const winChecker = new WinChecker(board);
                const actual = winChecker.getWinner();
                expect(actual).toStrictEqual(null);
            });
        });

        describe('When constant y,z line of same type', () => {
            it('Should return a winner', () => {
                const board = new AbstractBoard();
                const winChecker = new WinChecker(board);
                board.stack({ x: 0, y: 0 }, new TestPiece());
                board.stack({ x: 1, y: 0 }, new TestPiece());
                board.stack({ x: 2, y: 0 }, new TestPiece());
                board.stack({ x: 3, y: 0 }, new TestPiece());

                const actual = winChecker.getWinner();
                expect(actual).toBeTruthy();
            });
        });

        describe('When constant x,z line of same type', () => {
            it('Should return a winner', () => {
                const board = new AbstractBoard();
                const winChecker = new WinChecker(board);
                board.stack({ x: 0, y: 0 }, new TestPiece());
                board.stack({ x: 0, y: 1 }, new TestPiece());
                board.stack({ x: 0, y: 2 }, new TestPiece());
                board.stack({ x: 0, y: 3 }, new TestPiece());

                const actual = winChecker.getWinner();
                expect(actual).toBeTruthy();
            });
        });

        describe('When constant x,y column of same type', () => {
            it('Should return a winner', () => {
                const board = new AbstractBoard();
                const winChecker = new WinChecker(board);
                board.stack({ x: 0, y: 0 }, new TestPiece());
                board.stack({ x: 0, y: 0 }, new TestPiece());
                board.stack({ x: 0, y: 0 }, new TestPiece());
                board.stack({ x: 0, y: 0 }, new TestPiece());

                const actual = winChecker.getWinner();
                expect(actual).toBeTruthy();
            });
        });

        describe('When constant y diagonal of same type', () => {
            it('Should return a winner', () => {
                const board = new AbstractBoard();
                const winChecker = new WinChecker(board);
                board.stack({ x: 0, y: 0 }, new TestPiece());
                board.stack({ x: 1, y: 0 }, new TestPiece2());
                board.stack({ x: 1, y: 0 }, new TestPiece());
                board.stack({ x: 2, y: 0 }, new TestPiece2());
                board.stack({ x: 2, y: 0 }, new TestPiece2());
                board.stack({ x: 2, y: 0 }, new TestPiece());
                board.stack({ x: 3, y: 0 }, new TestPiece2());
                board.stack({ x: 3, y: 0 }, new TestPiece2());
                board.stack({ x: 3, y: 0 }, new TestPiece2());
                board.stack({ x: 3, y: 0 }, new TestPiece());

                const actual = winChecker.getWinner();
                expect(actual).toBeTruthy();
            });
        });

        describe('When constant x diagonal of same type', () => {
            it('Should return a winner', () => {
                const board = new AbstractBoard();
                const winChecker = new WinChecker(board);
                board.stack({ x: 0, y: 0 }, new TestPiece());
                board.stack({ x: 0, y: 1 }, new TestPiece2());
                board.stack({ x: 0, y: 1 }, new TestPiece());
                board.stack({ x: 0, y: 2 }, new TestPiece2());
                board.stack({ x: 0, y: 2 }, new TestPiece2());
                board.stack({ x: 0, y: 2 }, new TestPiece());
                board.stack({ x: 0, y: 3 }, new TestPiece2());
                board.stack({ x: 0, y: 3 }, new TestPiece2());
                board.stack({ x: 0, y: 3 }, new TestPiece2());
                board.stack({ x: 0, y: 3 }, new TestPiece());

                const actual = winChecker.getWinner();
                expect(actual).toBeTruthy();
            });
        });

        describe('When constant z diagonal of same type', () => {
            const board = new AbstractBoard();
            const winChecker = new WinChecker(board);
            board.stack({ x: 0, y: 0 }, new TestPiece());
            board.stack({ x: 1, y: 1 }, new TestPiece());
            board.stack({ x: 2, y: 2 }, new TestPiece());
            board.stack({ x: 3, y: 3 }, new TestPiece());

            const actual = winChecker.getWinner();
            expect(actual).toBeTruthy();
        });

        describe('When internal ascending diagonal of same type', () => {
            it('Should return a winner', () => {
                const board = new AbstractBoard();
                const winChecker = new WinChecker(board);
                board.stack({ x: 0, y: 0 }, new TestPiece());
                board.stack({ x: 1, y: 1 }, new TestPiece2());
                board.stack({ x: 1, y: 1 }, new TestPiece());
                board.stack({ x: 2, y: 2 }, new TestPiece2());
                board.stack({ x: 2, y: 2 }, new TestPiece2());
                board.stack({ x: 2, y: 2 }, new TestPiece());
                board.stack({ x: 3, y: 3 }, new TestPiece2());
                board.stack({ x: 3, y: 3 }, new TestPiece2());
                board.stack({ x: 3, y: 3 }, new TestPiece2());
                board.stack({ x: 3, y: 3 }, new TestPiece());

                const actual = winChecker.getWinner();
                expect(actual).toBeTruthy();
            });
        });

        describe('When internal descending diagonal of same type', () => {
            it('Should return a winner', () => {
                const board = new AbstractBoard();
                const winChecker = new WinChecker(board);
                board.stack({ x: 0, y: 0 }, new TestPiece2());
                board.stack({ x: 0, y: 0 }, new TestPiece2());
                board.stack({ x: 0, y: 0 }, new TestPiece2());
                board.stack({ x: 0, y: 0 }, new TestPiece());
                board.stack({ x: 1, y: 1 }, new TestPiece2());
                board.stack({ x: 1, y: 1 }, new TestPiece2());
                board.stack({ x: 1, y: 1 }, new TestPiece());
                board.stack({ x: 2, y: 2 }, new TestPiece2());
                board.stack({ x: 2, y: 2 }, new TestPiece());
                board.stack({ x: 3, y: 3 }, new TestPiece());

                const actual = winChecker.getWinner();
                expect(actual).toBeTruthy();
            });
        });
    });
});
