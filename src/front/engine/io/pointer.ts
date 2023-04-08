import { Vector } from '../math/vector';

type OnMoveCallback = (offset: Vector<[number, number]>) => void;

export class Pointer {
    private moveCallbacks: Array<OnMoveCallback> = [];

    constructor(private element: HTMLElement) {
        element.addEventListener('mousemove', (event) => {
            this.moveCallbacks.forEach((callback) => {
                callback(new Vector(event.movementX, event.movementY));
            });
        });
    }

    onMove(callback: OnMoveCallback): void {
        this.moveCallbacks.push(callback);
    }

    lock(): void {
        if (document.pointerLockElement === this.element) {
            return;
        }
        // A user gesture is required to request Pointer Lock
        this.element.addEventListener('click', () => {
            this.element.requestPointerLock();
        });
    }

    unlock(): void {
        document.exitPointerLock();
    }
}
