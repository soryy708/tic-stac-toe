import { AbstractBoard, BoardPosition } from './board/abstract-board';
import { GamePiece } from './piece/interface';

function flat<T>(array: Array<Array<T>>): Array<T> {
    return array.reduce((prev, cur) => [...prev, ...cur]);
}

type PotentialWin = [GamePiece, GamePiece, GamePiece, GamePiece];

export class WinChecker {
    private winner: GamePiece = null;

    constructor(private board: AbstractBoard) {}

    public getWinner(): GamePiece {
        this.update();
        return this.winner;
    }

    private update(): void {
        const straights = this.getStraights();
        const diagonals = this.getDiagonals();
        const potentialWins = [...straights, ...diagonals];
        const win = potentialWins.find((potential) => this.isWin(potential));
        this.winner = win ? win[0] : null;
    }

    private isWin(potential: PotentialWin): boolean {
        let same = true;
        for (let i = 0; i < potential.length - 1; ++i) {
            const cur = potential[i];
            const next = potential[i + 1];
            same &&= cur !== null && cur.isSameTypeAs(next);
        }
        return same;
    }

    private getStraights(): Array<PotentialWin> {
        const zeroToThree = [0, 1, 2, 3] as const;
        const rows = flat(
            zeroToThree.map((y) => zeroToThree.map((z) => this.getRowAt(y, z))),
        );
        const lines = flat(
            zeroToThree.map((x) =>
                zeroToThree.map((z) => this.getLineAt(x, z)),
            ),
        );
        const columns = flat(
            zeroToThree.map((x) =>
                zeroToThree.map((y) => this.getColumnAt(x, y)),
            ),
        );
        return [...rows, ...lines, ...columns];
    }

    private getRowAt(y: BoardPosition, z: BoardPosition): PotentialWin {
        const zeroToThree = [0, 1, 2, 3] as const;
        return zeroToThree.map((x) => this.board.getCell(x, y, z)) as never;
    }

    private getLineAt(x: BoardPosition, z: BoardPosition): PotentialWin {
        const zeroToThree = [0, 1, 2, 3] as const;
        return zeroToThree.map((y) => this.board.getCell(x, y, z)) as never;
    }

    private getColumnAt(x: BoardPosition, y: BoardPosition): PotentialWin {
        const zeroToThree = [0, 1, 2, 3] as const;
        return zeroToThree.map((z) => this.board.getCell(x, y, z)) as never;
    }

    private getDiagonals(): Array<PotentialWin> {
        return flat([
            this.getDiagonalsOfVector(1, 0, 1),
            this.getDiagonalsOfVector(1, 0, -1),
            this.getDiagonalsOfVector(0, 1, 1),
            this.getDiagonalsOfVector(0, 1, -1),
            this.getInternalDiagonals(),
        ]);
    }

    private getDiagonalsOfVector(
        x: 0 | 1 | -1,
        y: 0 | 1 | -1,
        z: 0 | 1 | -1,
    ): Array<PotentialWin> {
        const zeroToThree = [0, 1, 2, 3] as const;
        return zeroToThree.map((i) => {
            const perpendicularX = y !== 0 ? 1 : 0;
            const perpendicularY = x !== 0 ? 1 : 0;
            const xStart = (x < 0 ? 3 : 0) + i * perpendicularX;
            const yStart = (y < 0 ? 3 : 0) + i * perpendicularY;
            const zStart = z < 0 ? 3 : 0;
            return zeroToThree.map((j) =>
                this.board.getCell(
                    (xStart + j * x) as never,
                    (yStart + j * y) as never,
                    (zStart + j * z) as never,
                ),
            ) as PotentialWin;
        });
    }

    private getInternalDiagonals(): [
        PotentialWin,
        PotentialWin,
        PotentialWin,
        PotentialWin,
    ] {
        const zeroToThree = [0, 1, 2, 3] as const;
        return [
            zeroToThree.map((i) => this.board.getCell(i, i, i)) as never,
            zeroToThree.map((i) =>
                this.board.getCell(i, i, (3 - i) as never),
            ) as never,
            zeroToThree.map((i) =>
                this.board.getCell((3 - i) as never, i, i),
            ) as never,
            zeroToThree.map((i) =>
                this.board.getCell((3 - i) as never, i, (3 - i) as never),
            ) as never,
        ];
    }
}
