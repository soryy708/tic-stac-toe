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
import { showMessageBar } from './message-bar';
import { Vector } from '../engine/math/vector';
import { AiSolver } from './ai/solver';

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
    private ai: AiSolver;

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
        this.ai = new AiSolver(this.board);
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
        if (this.board.canStack(position.x, position.y)) {
            this.cursor.show();
            const coordinates = this.board.getCellWorldCoordinates(position);

            const stackHeight = this.board.getStackHeight(position);
            const zDistance = 2;
            const zOffset = zDistance * stackHeight;
            this.cursor.setPosition(
                coordinates.addVector(new Vector(0, 0, zOffset)),
            );
        } else {
            this.cursor.hide();
        }
    }

    private onBoardLeave() {
        this.boardPosition = null;
        this.cursor.hide();
    }

    private onClick() {
        if (!this.boardPosition || this.currentPlayer === 'player2') {
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
            showMessageBar(`${this.currentPlayer} wins!`);
            this.reset();
            return;
        }

        if (this.currentPlayer === 'player1') {
            this.currentPlayer = 'player2';
            this.playAsAi();
        } else {
            this.currentPlayer = 'player1';
        }
    }

    private playAsAi(): void {
        const sleep = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));
        const sleepPromise = sleep(500);
        const position = this.ai.solveNextTurn(
            new Nought({ x: 0, y: 0, z: 0 }),
        );
        sleepPromise.then(() => {
            const piece = this.buildCurrentPlayerPiece({
                ...position,
                z: this.board.getStackHeight(position),
            });
            this.board.stack(position, piece);
            this.advanceTurn();
        });
    }

    private reset() {
        this.currentPlayer = 'player1';

        const allPieces = this.board.getAllPieces();
        this.board.clear();
        allPieces.forEach((piece) => piece.destroy());
    }
}
