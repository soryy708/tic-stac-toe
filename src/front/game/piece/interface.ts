import { Engine } from '../../engine';

export interface GamePiece {
    bootstrap(engine: Engine): void;
    isSameTypeAs(other: GamePiece): boolean;
}
