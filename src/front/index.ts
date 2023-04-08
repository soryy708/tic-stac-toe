import { Engine } from './engine';
import { Game } from './game';

function bootstrap(canvas: HTMLCanvasElement): void {
    const engine = new Engine({ canvas, window }, { targetFps: 60 });
    engine.bootstrap();

    const game = new Game(engine);
    game.bootstrap();

    engine.onFrame((deltaTime: number) => {
        game.tick(deltaTime);
    });
}

function init(canvasElementId: string): void {
    const canvas = document.getElementById(
        canvasElementId,
    ) as HTMLCanvasElement;
    if (!canvas) {
        throw new Error('No canvas element found with ID ' + canvasElementId);
    }
    bootstrap(canvas);
}

init('canvas');
