import { Engine } from '../../engine';

export interface GamePiece {
    bootstrap(engine: Engine): void;
    destroy(): void;
    isSameTypeAs(other: GamePiece): boolean;
}
