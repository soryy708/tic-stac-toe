import { AbstractBoard, BoardPosition } from '../board/abstract-board';
import { GamePiece } from '../piece/interface';
import { Evaluator } from './evaluator';

class Opponent implements GamePiece {
    bootstrap() {
        // nop
    }

    destroy() {
        // nop
    }

    isSameTypeAs(other: GamePiece): boolean {
        return other instanceof Opponent;
    }
}

class Identity implements GamePiece {
    bootstrap() {
        // nop
    }

    destroy() {
        // nop
    }

    isSameTypeAs(other: GamePiece): boolean {
        return other instanceof Identity;
    }
}

describe('Evaluator', () => {
    describe('When given an empty board', () => {
        it('Should return the same value for all plays', () => {
            const board = new AbstractBoard();
            const evaluator = new Evaluator();
            let prevValue = evaluator.evaluate(
                board,
                { x: 0, y: 0 },
                new Identity(),
                new Opponent(),
            );
            for (let y = 0; y < 4; ++y) {
                for (let x = 0; x < 4; ++x) {
                    const value = evaluator.evaluate(
                        board,
                        {
                            x: x as BoardPosition,
                            y: y as BoardPosition,
                        },
                        new Identity(),
                        new Opponent(),
                    );
                    expect(value).toEqual(prevValue);
                    prevValue = value;
                }
            }
        });
    });

    describe('When given a board where about to lose', () => {
        describe('When loss is vertical', () => {
            it('Should give highest value to preventing loss', () => {
                const board = new AbstractBoard();
                board.stack({ x: 0, y: 0 }, new Opponent());
                board.stack({ x: 0, y: 0 }, new Opponent());
                board.stack({ x: 0, y: 0 }, new Opponent());
                const evaluator = new Evaluator();

                const maxValue = evaluator.evaluate(
                    board,
                    { x: 0, y: 0 },
                    new Identity(),
                    new Opponent(),
                );
                for (let y = 0; y < 4; ++y) {
                    for (let x = 0; x < 4; ++x) {
                        if (x === 0 && y === 0) {
                            continue;
                        }
                        const value = evaluator.evaluate(
                            board,
                            {
                                x: x as BoardPosition,
                                y: y as BoardPosition,
                            },
                            new Identity(),
                            new Opponent(),
                        );
                        expect(value).toBeLessThan(maxValue);
                    }
                }
            });
        });

        describe('When loss is horizontal', () => {
            it('Should give highest value to preventing loss', () => {
                const board = new AbstractBoard();
                board.stack({ x: 0, y: 0 }, new Opponent());
                board.stack({ x: 1, y: 0 }, new Opponent());
                board.stack({ x: 2, y: 0 }, new Opponent());
                const evaluator = new Evaluator();

                const maxValue = evaluator.evaluate(
                    board,
                    { x: 3, y: 0 },
                    new Identity(),
                    new Opponent(),
                );
                for (let y = 0; y < 4; ++y) {
                    for (let x = 0; x < 4; ++x) {
                        if (x === 3 && y === 0) {
                            continue;
                        }
                        const value = evaluator.evaluate(
                            board,
                            {
                                x: x as BoardPosition,
                                y: y as BoardPosition,
                            },
                            new Identity(),
                            new Opponent(),
                        );
                        expect(value).toBeLessThan(maxValue);
                    }
                }
            });
        });
    });

    describe('When given a board where about to win', () => {
        it('Should give highest value to winning', () => {
            const board = new AbstractBoard();
            board.stack({ x: 0, y: 0 }, new Identity());
            board.stack({ x: 1, y: 0 }, new Identity());
            board.stack({ x: 2, y: 0 }, new Identity());
            const evaluator = new Evaluator();

            const maxValue = evaluator.evaluate(
                board,
                { x: 3, y: 0 },
                new Identity(),
                new Opponent(),
            );
            for (let y = 0; y < 4; ++y) {
                for (let x = 0; x < 4; ++x) {
                    if (x === 3 && y === 0) {
                        continue;
                    }
                    const value = evaluator.evaluate(
                        board,
                        {
                            x: x as BoardPosition,
                            y: y as BoardPosition,
                        },
                        new Identity(),
                        new Opponent(),
                    );
                    expect(value).toBeLessThan(maxValue);
                }
            }
        });
    });

    describe('When given choice between winning or preventing loss', () => {
        it('Should prefer to win', () => {
            const board = new AbstractBoard();
            board.stack({ x: 0, y: 0 }, new Identity());
            board.stack({ x: 1, y: 0 }, new Identity());
            board.stack({ x: 2, y: 0 }, new Identity());
            const winningMove = { x: 3, y: 0 } as const;
            board.stack({ x: 0, y: 1 }, new Opponent());
            board.stack({ x: 1, y: 1 }, new Opponent());
            board.stack({ x: 2, y: 1 }, new Opponent());
            const lossPreventingMove = { x: 3, y: 1 } as const;
            const evaluator = new Evaluator();

            const winningMoveValue = evaluator.evaluate(
                board,
                winningMove,
                new Identity(),
                new Opponent(),
            );
            const lossPreventingMoveValue = evaluator.evaluate(
                board,
                lossPreventingMove,
                new Identity(),
                new Opponent(),
            );

            expect(winningMoveValue).toBeGreaterThan(lossPreventingMoveValue);
        });
    });
});
