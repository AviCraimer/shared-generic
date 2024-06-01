// MonoMap mirrors the interface of a JS map, but ensures that there is a reverse lookup in a one-to-one bidirectional mapping.

const lookupSymbol = Symbol("MonoMap Lookup Key");
type IsoMapType<K, V> = Map<K, V> & {
    getKey: (value: V) => K | undefined;
    setOver: Map<K, V>["set"];
    inverse: () => MonoMap<V, K>;
};

export class MonoMap<K, V> implements IsoMapType<K, V> {
    private [lookupSymbol]: [forwards: Map<K, V>, reverse: Map<V, K>];
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
        if (reverseMap.has(value)) {
            // If the value is already mapped to a key, do not overwrite
            return this;
        }
        forwardMap.set(key, value);
        reverseMap.set(value, key);
        return this;
    }
    setOver(key: K, value: V): this {
        const [forwardMap, reverseMap] = this[lookupSymbol];
        const existingKey = reverseMap.get(value);
        if (existingKey !== undefined) {
            // If the value is already mapped to a key, delete the existing mapping
            forwardMap.delete(existingKey);
            reverseMap.delete(value);
        }
        forwardMap.set(key, value);
        reverseMap.set(value, key);
        return this;
    }
    delete(key: K): boolean {
        const [forwardMap, reverseMap] = this[lookupSymbol];
        const value = forwardMap.get(key);
        const deleted = forwardMap.delete(key);
        if (deleted && value !== undefined) {
            reverseMap.delete(value);
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
        return "MonoMap";
    }
    getKey(value: V): K | undefined {
        const reverseMap = this[lookupSymbol][1];
        return reverseMap.get(value);
    }
    inverse(): MonoMap<V, K> {
        const [forwardMap, reverseMap] = this[lookupSymbol];
        const inverseMap = new MonoMap<V, K>();
        inverseMap[lookupSymbol] = [reverseMap, forwardMap];
        return inverseMap;
    }
}
