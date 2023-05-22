import { Engine } from '../engine';
import { Box } from '../engine/gfx/renderable/box';
import { OrbitIo } from '../engine/io/orbit';
import { Pointer } from '../engine/io/pointer';
import { Raycaster } from '../engine/io/raycaster';
import { BoardPosition } from './board/abstract-board';
import { Board } from './board/board';
import { Cross } from './piece/cross';
import { Nought } from './piece/nought';
import { GamePiece } from './piece/interface';
import { WinChecker } from './win';

type Player = 'player1' | 'player2';

export class Game {
    private currentPlayer: Player = 'player1';
    private board: Board;
    private cursor = new Box({ width: 1, height: 1, depth: 1 });
    private orbitIo: OrbitIo;
    private raycaster: Raycaster;
    private pointer: Pointer;
    private boardPosition: { x: BoardPosition; y: BoardPosition } = null;
    private winChecker: WinChecker;

    constructor(private engine: Engine) {}

    bootstrap(): void {
        this.pointer = new Pointer(this.engine.getRendererContext().canvas);
        this.raycaster = new Raycaster(this.engine, this.pointer);
        this.board = new Board(this.raycaster);
        this.board.onHover((position) => this.onBoardHover(position));
        this.board.onLeave(() => this.onBoardLeave());
        this.board.bootstrap(this.engine);
        this.cursor.setColor({ r: 255, g: 255, b: 0 });
        this.cursor.hide();
        this.cursor.registerRenderer(this.engine.getRendererContext());
        this.orbitIo = new OrbitIo(this.engine);
        this.orbitIo.setTarget(this.board.getCenter());
        this.pointer.onClick(() => this.onClick());
        this.winChecker = new WinChecker(this.board);
    }

    tick(_deltaTime: number) {
        this.raycaster.tick();
        this.board.tick();
    }

    private onBoardHover(position: {
        x: BoardPosition;
        y: BoardPosition;
    }): void {
        this.boardPosition = position;
        this.cursor.show();
        const coordinates = this.board.getCellWorldCoordinates(position);
        this.cursor.setPosition(coordinates);
    }

    private onBoardLeave() {
        this.boardPosition = null;
        this.cursor.hide();
    }

    private onClick() {
        if (!this.boardPosition) {
            return;
        }

        if (this.board.canStack(this.boardPosition.x, this.boardPosition.y)) {
            const piece = this.buildCurrentPlayerPiece({
                ...this.boardPosition,
                z: this.board.getStackHeight(this.boardPosition),
            });
            this.board.stack(this.boardPosition, piece);
            this.advanceTurn();
        }
    }

    private buildCurrentPlayerPiece(boardPosition: {
        x: BoardPosition;
        y: BoardPosition;
        z: BoardPosition;
    }): GamePiece {
        const pieceTypes = {
            player1: Cross,
            player2: Nought,
        };
        const PieceType = pieceTypes[this.currentPlayer];
        const piece = new PieceType(boardPosition);
        piece.bootstrap(this.engine);
        return piece;
    }

    private advanceTurn(): void {
        const win = this.winChecker.getWinner();
        if (win) {
            console.log(`${this.currentPlayer} wins`);
            this.reset();
            return;
        }

        if (this.currentPlayer === 'player1') {
            this.currentPlayer = 'player2';
        } else {
            this.currentPlayer = 'player1';
        }
    }

    private reset() {
        // TODO: Set current player
        // TODO: Clear the board
    }
}
