// FiberMap mirrors the interface of a JS Map, but ensures that there is a fibered reverse lookup, such that the reverse lookup goes from values to the set of keys that map to those values.

const lookupSymbol = Symbol("FiberedMap Lookup Key");

type FiberedMapType<K, V> = Map<K, V> & {
    // Implement the JS Map interface
    getFiber: (value: V) => Set<K>; // Returns set of keys that map to value (empty set if no keys map to it)
};

// TODO: Code created with help of Claude 3 Opus. Needs human review and testing.
export class FiberedMap<K, V> implements FiberedMapType<K, V> {
    private [lookupSymbol]: [forwards: Map<K, V>, reverse: Map<V, Set<K>>];

    constructor() {
        this[lookupSymbol] = [new Map(), new Map()];
    }

    get size(): number {
        return this[lookupSymbol][0].size;
    }

    get(key: K): V | undefined {
        return this[lookupSymbol][0].get(key);
    }

    has(key: K): boolean {
        return this[lookupSymbol][0].has(key);
    }

    set(key: K, value: V): this {
        const [forwardMap, reverseMap] = this[lookupSymbol];
        forwardMap.set(key, value);
        const fiber = reverseMap.get(value);
        if (fiber) {
            fiber.add(key);
        } else {
            reverseMap.set(value, new Set([key]));
        }
        return this;
    }

    delete(key: K): boolean {
        const [forwardMap, reverseMap] = this[lookupSymbol];
        const value = forwardMap.get(key);
        const deleted = forwardMap.delete(key);
        if (deleted && value !== undefined) {
            const fiber = reverseMap.get(value);
            if (fiber) {
                fiber.delete(key);
                if (fiber.size === 0) {
                    reverseMap.delete(value);
                }
            }
        }
        return deleted;
    }

    clear(): void {
        const [forwardMap, reverseMap] = this[lookupSymbol];
        forwardMap.clear();
        reverseMap.clear();
    }

    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
        const forwardMap = this[lookupSymbol][0];
        forwardMap.forEach(callbackfn, thisArg);
    }

    *entries(): IterableIterator<[K, V]> {
        const forwardMap = this[lookupSymbol][0];
        yield* forwardMap.entries();
    }

    *keys(): IterableIterator<K> {
        const forwardMap = this[lookupSymbol][0];
        yield* forwardMap.keys();
    }

    *values(): IterableIterator<V> {
        const forwardMap = this[lookupSymbol][0];
        yield* forwardMap.values();
    }

    [Symbol.iterator](): IterableIterator<[K, V]> {
        return this.entries();
    }

    get [Symbol.toStringTag](): string {
        return "FiberedMap";
    }

    getFiber(value: V): Set<K> {
        const reverseMap = this[lookupSymbol][1];
        return reverseMap.get(value) || new Set();
    }
}
