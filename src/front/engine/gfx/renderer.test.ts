import gl from 'gl';
import { createCanvas } from 'canvas';
import { Renderer } from './renderer';
import { GraphicsScene } from './scene';

const createMockCanvas = (): HTMLCanvasElement => {
    const canvas = createCanvas(852, 480);
    (canvas as any).addEventListener = jest.fn(); // eslint-disable-line @typescript-eslint/no-explicit-any
    (canvas as any).style = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    return canvas as never;
};

const createMockWindow = (): jest.Mocked<Window> =>
    ({
        requestAnimationFrame: jest.fn(),
    } as never);

const createMockWebGLContext = () => gl(852, 480);

describe('Renderer', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('When window is resized', () => {
        let mockWindow: jest.Mocked<Window> = null;
        let mockCanvas: HTMLCanvasElement = null;
        const aspectRatio = 16 / 9;

        beforeEach(() => {
            mockWindow = createMockWindow();
            mockCanvas = createMockCanvas();
            jest.spyOn(mockCanvas, 'getContext').mockReturnValue({} as never);
            const renderer = new Renderer(
                mockCanvas,
                mockWindow,
                new GraphicsScene(),
                createMockWebGLContext(),
            );
            renderer.bootstrap();
        });

        const fakeWindowResize = (width: number, height: number) => {
            (mockWindow as any).innerWidth = width; // eslint-disable-line @typescript-eslint/no-explicit-any
            (mockWindow as any).innerHeight = height; // eslint-disable-line @typescript-eslint/no-explicit-any
            if (mockWindow.onresize) {
                mockWindow.onresize(null);
            }
        };

        describe('When resized to landscape resolution', () => {
            describe('When too wide', () => {
                beforeEach(() => {
                    fakeWindowResize(17, 9);
                });

                it('Should crop width', () => {
                    expect(mockCanvas.width).toBe(16);
                });

                it('Should have maximum height', () => {
                    expect(mockCanvas.height).toBe(9);
                });
            });

            describe('When too narrow', () => {
                beforeEach(() => {
                    fakeWindowResize(15, 9);
                });

                it('Should have maximum width', () => {
                    expect(mockCanvas.width).toBe(15);
                });

                it('Should crop height', () => {
                    expect(mockCanvas.height).toBe(
                        Math.floor(15 / aspectRatio),
                    );
                });
            });

            describe('When too tall', () => {
                beforeEach(() => {
                    fakeWindowResize(16, 10);
                });

                it('Should have maximum width', () => {
                    expect(mockCanvas.width).toBe(16);
                });

                it('Should crop height', () => {
                    expect(mockCanvas.height).toBe(
                        Math.floor(16 / aspectRatio),
                    );
                });
            });

            describe('When too short', () => {
                beforeEach(() => {
                    fakeWindowResize(16, 8);
                });

                it('Should have maximum width', () => {
                    expect(mockCanvas.width).toBe(Math.floor(8 * aspectRatio));
                });

                it('Should crop height', () => {
                    expect(mockCanvas.height).toBe(8);
                });
            });
        });

        describe('When resized to portrait resolution', () => {
            describe('When too wide', () => {
                beforeEach(() => {
                    fakeWindowResize(10, 16);
                });

                it('Should crop width', () => {
                    expect(mockCanvas.width).toBe(Math.floor(16 / aspectRatio));
                });

                it('Should have maximum height', () => {
                    expect(mockCanvas.height).toBe(16);
                });
            });

            describe('When too narrow', () => {
                beforeEach(() => {
                    fakeWindowResize(8, 16);
                });

                it('Should have maximum width', () => {
                    expect(mockCanvas.width).toBe(8);
                });

                it('Should crop height', () => {
                    expect(mockCanvas.height).toBe(Math.floor(8 * aspectRatio));
                });
            });

            describe('When too tall', () => {
                beforeEach(() => {
                    fakeWindowResize(9, 17);
                });

                it('Should have maximum width', () => {
                    expect(mockCanvas.width).toBe(9);
                });

                it('Should crop height', () => {
                    expect(mockCanvas.height).toBe(Math.floor(9 * aspectRatio));
                });
            });

            describe('When too short', () => {
                beforeEach(() => {
                    fakeWindowResize(9, 15);
                });

                it('Should crop width', () => {
                    expect(mockCanvas.width).toBe(Math.floor(15 / aspectRatio));
                });

                it('Should have maximum height', () => {
                    expect(mockCanvas.height).toBe(15);
                });
            });
        });
    });
});
