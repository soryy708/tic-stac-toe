import { RendererContext } from './gfx/context';
import { Renderer } from './gfx/renderer';
import { GraphicsScene } from './gfx/scene';

type BrowserContext = {
    canvas: HTMLCanvasElement;
    window: Window;
};

type EngineOptions = { targetFps: number };

type OnFrameCallback = (deltaTime: number) => void;

export class Engine {
    private scene = new GraphicsScene();
    private renderer: Renderer;
    private onFrameObservers: OnFrameCallback[] = [];
    private lastIterationTime: number;

    constructor(
        private browserContext: BrowserContext,
        private options: EngineOptions,
    ) {
        this.renderer = new Renderer(
            this.browserContext.canvas,
            this.browserContext.window,
            this.scene,
        );
    }

    bootstrap(): void {
        this.renderer.bootstrap();

        const msBetweenFrames = 1000 / this.options.targetFps;
        this.lastIterationTime = Date.now();
        setInterval(() => this.onMainLoopIteration(), msBetweenFrames);
    }

    onFrame(callback: OnFrameCallback): void {
        this.onFrameObservers.push(callback);
    }

    getRendererContext(): RendererContext {
        return {
            renderer: this.renderer,
            scene: this.scene,
            canvas: this.browserContext.canvas,
        };
    }

    private onMainLoopIteration(): void {
        const now = Date.now();
        const deltaTime = (now - this.lastIterationTime) / 1000;

        this.renderer.tick();
        this.notifyOnFrameObservers(deltaTime);

        this.lastIterationTime = now;
    }

    private notifyOnFrameObservers(deltaTime: number) {
        this.onFrameObservers.forEach((observer) => observer(deltaTime));
    }
}
