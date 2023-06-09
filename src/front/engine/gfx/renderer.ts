import {
    PerspectiveCamera as ThreeCamera,
    WebGLRenderer,
    DirectionalLight,
    AmbientLight,
} from 'three';
import { GraphicsScene } from './scene';

const aspectRatio = 16 / 9;

export class Renderer {
    private threeCamera: ThreeCamera;
    private threeRenderer: WebGLRenderer;

    constructor(
        private canvas: HTMLCanvasElement,
        private window: Window,
        private scene: GraphicsScene,
        private glContext?: WebGLRenderingContext,
    ) {
        if (!canvas) {
            throw new Error('Canvas is undefined');
        }

        const fov = 90;
        const aspect = this.window.innerWidth / this.window.innerHeight;
        const nearClip = 0.1;
        const farClip = 1024;
        this.threeCamera = new ThreeCamera(fov, aspect, nearClip, farClip);

        // Magic numbers for quick prototyping.
        // This will need to be removed, to let the game control it
        this.threeCamera.position.z = 5;
        const directionalLight = new DirectionalLight(0xffffff, 0.5);
        directionalLight.position.x = 1;
        directionalLight.position.y = 1;
        directionalLight.position.z = 1;
        this.scene.getInternal().add(directionalLight);
        const ambientLight = new AmbientLight(0xffffff, 0.25);
        this.scene.getInternal().add(ambientLight);

        this.threeRenderer = new WebGLRenderer({
            canvas,
            antialias: true,
            context: this.glContext,
        });
        this.threeRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    bootstrap() {
        const onAnimationFrame = () => {
            this.tick();
            this.window.requestAnimationFrame(onAnimationFrame);
        };
        this.window.requestAnimationFrame(onAnimationFrame);

        this.window.onresize = () => this.onWindowResize();
        this.onWindowResize();
    }

    tick() {
        this.threeRenderer.clear();
        this.threeRenderer.render(this.scene.getInternal(), this.threeCamera);
    }

    getInternal(): WebGLRenderer {
        return this.threeRenderer;
    }

    getInternalCamera(): ThreeCamera {
        return this.threeCamera;
    }

    private onWindowResize() {
        let { width, height } = this.dimensions();

        width = Math.floor(width);
        height = Math.floor(height);

        this.canvas.width = width;
        this.canvas.height = height;
        // We set `style` as well, because ThreeJS uses it
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;

        this.threeCamera.updateProjectionMatrix();
        this.threeRenderer.setSize(width, height);
    }

    private dimensions(): { width: number; height: number } {
        const landscape = this.window.innerWidth > this.window.innerHeight;
        return landscape
            ? this.landscapeDimensions()
            : this.portraitDimensions();
    }

    private landscapeDimensions(): { width: number; height: number } {
        const maxWidth =
            this.window.innerWidth < this.window.innerHeight * aspectRatio;
        return maxWidth
            ? {
                  width: this.window.innerWidth,
                  height: this.window.innerWidth / aspectRatio,
              }
            : {
                  height: this.window.innerHeight,
                  width: this.window.innerHeight * aspectRatio,
              };
    }

    private portraitDimensions(): { width: number; height: number } {
        const maxHeight =
            this.window.innerHeight < this.window.innerWidth * aspectRatio;
        return maxHeight
            ? {
                  height: this.window.innerHeight,
                  width: this.window.innerHeight / aspectRatio,
              }
            : {
                  width: this.window.innerWidth,
                  height: this.window.innerWidth * aspectRatio,
              };
    }
}
