import { Vector } from '../math/vector';

type OnMoveCallback = (offset: Vector<[number, number]>) => void;
type OnClickCallback = () => void;

export class Pointer {
    private moveCallbacks: Array<OnMoveCallback> = [];
    private clickCallbacks: Array<OnClickCallback> = [];
    private ndcX = NaN;
    private ndcY = NaN;

    constructor(private element: HTMLElement) {
        element.addEventListener('mousemove', (event) => {
            const relativeX = event.clientX - element.offsetLeft;
            const relativeY = event.clientY - element.offsetTop;
            this.ndcX = (relativeX / element.clientWidth) * 2 - 1;
            this.ndcY = (relativeY / element.clientHeight) * -2 + 1;

            this.moveCallbacks.forEach((callback) => {
                callback(new Vector(event.movementX, event.movementY));
            });
        });

        element.addEventListener('click', () => {
            this.clickCallbacks.forEach((callback) => {
                callback();
            });
        });
    }

    onMove(callback: OnMoveCallback): void {
        this.moveCallbacks.push(callback);
    }

    onClick(callback: OnClickCallback): void {
        this.clickCallbacks.push(callback);
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

    getNdcCoordinates(): Vector<[number, number]> {
        if (isNaN(this.ndcX) || isNaN(this.ndcY)) {
            return new Vector(0, 0);
        }
        return new Vector(this.ndcX, this.ndcY);
    }
}
