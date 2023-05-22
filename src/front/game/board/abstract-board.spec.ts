import { Engine } from '../../engine';
import { AbstractBoard, BoardPosition } from './abstract-board';
import { GamePiece } from '../piece/interface';

class TestingPiece implements GamePiece {
    bootstrap(_engine: Engine): void {
        // nop
    }

    destroy(): void {
        // nop
    }

    isSameTypeAs(_other: GamePiece): boolean {
        return false;
    }
}

describe('Board unit tests', () => {
    describe('When checking if can stack', () => {
        describe.each([0, 1, 2, 3])('When stack has %d items', (items) => {
            it('Should return true', () => {
                const board = new AbstractBoard();
                const position: { x: BoardPosition; y: BoardPosition } = {
                    x: 0,
                    y: 0,
                };
                for (let i = 0; i < items; ++i) {
                    board.stack(position, new TestingPiece());
                }

                const actual = board.canStack(position.x, position.y);

                expect(actual).toStrictEqual(true);
            });
        });

        describe('When stack has 4 items', () => {
            it('Should return false', () => {
                const board = new AbstractBoard();
                const position: { x: BoardPosition; y: BoardPosition } = {
                    x: 0,
                    y: 0,
                };
                for (let i = 0; i < 4; ++i) {
                    board.stack(position, new TestingPiece());
                }

                const actual = board.canStack(position.x, position.y);

                expect(actual).toStrictEqual(false);
            });
        });
    });

    describe('When stacking', () => {
        describe('If cannot stack', () => {
            it('Should throw', () => {
                const board = new AbstractBoard();
                const position: { x: BoardPosition; y: BoardPosition } = {
                    x: 0,
                    y: 0,
                };
                for (let i = 0; i < 4; ++i) {
                    board.stack(position, new TestingPiece());
                }

                expect(() =>
                    board.stack(position, new TestingPiece()),
                ).toThrowError(new Error("Can't stack fully stacked column"));
            });
        });

        describe('If can stack', () => {
            describe.each([0, 1, 2, 3])(
                'When stack has %d items',
                (itemsBefore) => {
                    it(`Should stack on height ${itemsBefore}`, () => {
                        const board = new AbstractBoard();
                        const position: { x: BoardPosition; y: BoardPosition } =
                            {
                                x: 0,
                                y: 0,
                            };
                        for (let i = 0; i < itemsBefore; ++i) {
                            board.stack(position, new TestingPiece());
                        }

                        const piece = new TestingPiece();
                        board.stack(position, piece);

                        expect(
                            board.getCell(
                                position.x,
                                position.y,
                                itemsBefore as never,
                            ),
                        ).toStrictEqual(piece);
                    });
                },
            );
        });
    });

    describe('When getting cell', () => {
        describe("When there's nothing at the coordinates", () => {
            it('Should return null', () => {
                const board = new AbstractBoard();
                const actual = board.getCell(0, 0, 0);
                expect(actual).toStrictEqual(null);
            });
        });

        describe("When there's only one item on the board", () => {
            const itemCoordinates = { x: 2, y: 3, z: 0 } as const;
            let board: AbstractBoard = null;
            let piece: TestingPiece = null;

            beforeEach(() => {
                board = new AbstractBoard();
                piece = new TestingPiece();
                board.stack(itemCoordinates, piece);
            });

            it('Should return a reference to that item at its coordinates', () => {
                const actual = board.getCell(
                    itemCoordinates.x,
                    itemCoordinates.y,
                    0,
                );
                expect(actual).toStrictEqual(piece);
            });

            it('Should return null for all other coordinates', () => {
                for (let x = 0; x < 4; ++x) {
                    for (let y = 0; y < 4; ++y) {
                        for (let z = 0; z < 4; ++z) {
                            const atItemCoordinates =
                                x === itemCoordinates.x &&
                                y === itemCoordinates.y &&
                                z === itemCoordinates.z;
                            if (!atItemCoordinates) {
                                const actual = board.getCell(
                                    x as never,
                                    y as never,
                                    z as never,
                                );
                                expect(actual).toStrictEqual(null);
                            }
                        }
                    }
                }
            });
        });
    });

    describe('When getting stack height', () => {
        describe.each([0, 1, 2, 3, 4])(
            'When there are %d items in the stack',
            (items) => {
                it(`Should return ${items}`, () => {
                    const position = { x: 1, y: 2 } as const;
                    const board = new AbstractBoard();
                    for (let i = 0; i < items; ++i) {
                        board.stack(position, new TestingPiece());
                    }

                    const actual = board.getStackHeight(position);

                    expect(actual).toBe(items);
                });
            },
        );
    });
});
