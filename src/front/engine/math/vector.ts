// https://stackoverflow.com/questions/73919926/typescript-declare-type-of-index-of-tuple/73920028#73920028
type TupleIndices<T extends readonly unknown[]> = Extract<
    keyof T,
    `${number}`
> extends `${infer N extends number}`
    ? N
    : never;

export class Vector<T extends Array<number>> {
    private scalars: T;

    constructor(...scalars: T) {
        this.scalars = scalars;
    }

    get(index: TupleIndices<T>): number {
        return this.scalars[index];
    }

    set(index: TupleIndices<T>, value: number): void {
        this.scalars[index] = value;
    }

    addVector<T1 extends Array<number>, ResultType extends Array<number>>(
        vector: Vector<T1>,
    ): Vector<ResultType> {
        return new Vector<ResultType>(
            ...(this.scalars.map(
                (scalar, index) => scalar + vector.scalars[index],
            ) as ResultType),
        );
    }

    subtractVector<T1 extends Array<number>, ResultType extends Array<number>>(
        vector: Vector<T1>,
    ): Vector<ResultType> {
        return new Vector<ResultType>(
            ...(this.scalars.map(
                (scalar, index) => scalar - vector.scalars[index],
            ) as ResultType),
        );
    }

    multiplyScalar<ResultType extends Array<number>>(
        scalar: number,
    ): Vector<ResultType> {
        return new Vector<ResultType>(
            ...(this.scalars.map((s) => s * scalar) as ResultType),
        );
    }

    divideScalar<ResultType extends Array<number>>(
        scalar: number,
    ): Vector<ResultType> {
        return new Vector<ResultType>(
            ...(this.scalars.map((s) => s / scalar) as ResultType),
        );
    }

    magnitude(): number {
        return Math.sqrt(
            this.scalars
                .map((s) => Math.pow(s, 2))
                .reduce((sum, cur) => sum + cur, 0),
        );
    }

    normalize<ResultType extends Array<number>>(): Vector<ResultType> {
        const magnitude = this.magnitude();
        if (magnitude === 0) {
            // Avoid division by 0
            return new Vector<ResultType>(
                ...(this.scalars as never as ResultType),
            );
        }
        return this.divideScalar(magnitude);
    }

    clampMagnitude<ResultType extends Array<number>>(
        maxMagnitude: number,
    ): Vector<ResultType> {
        if (this.magnitude() <= maxMagnitude) {
            return this as never;
        }
        return this.normalize().multiplyScalar(maxMagnitude);
    }
}
