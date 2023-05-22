import { Vector2, Vector3 } from 'three';
import { Vector } from './vector';

/**
 * Adapter for our plain Vector to an internal representation
 */
export class VectorInternalAdapter {
    static toThree3(v: Vector<[number, number, number]>): Vector3 {
        return new Vector3(v.get(0), v.get(1), v.get(2));
    }

    static toThree2(v: Vector<[number, number]>): Vector2 {
        return new Vector2(v.get(0), v.get(1));
    }

    static toVector(v: Vector3): Vector<[number, number, number]> {
        return new Vector(v.x, v.y, v.z);
    }

    static setThree({
        target,
        source,
    }: {
        target: Vector3;
        source: Vector<[number, number, number]>;
    }): void {
        target.set(source.get(0), source.get(1), source.get(2));
    }
}
