import { Assert, Deny, TypeEq } from "./typeTesting";

// Switches from co-variant to contra-variant
type Contra<T> = T extends any ? (arg: T) => void : never;

type InferContra<T> = [T] extends [(arg: infer I) => void] ? I : never;

//Picks a single element from a union
type PickOne<T> = InferContra<InferContra<Contra<Contra<T>>>>;

// Testing for disjointness
export type Disjoint<T, S> = T & S extends never ? true : false;

type TestDisjoint1 = Assert<Disjoint<"cat", "animal">>;
type TestDisjoint2 = Deny<Disjoint<"cat" | "animal", "animal">>;
type TestDisjoint3 = Deny<Disjoint<"cat", string>>;
// Even though never is a subtype of everything it has to be disjoint if you define disjointness by intersection.
type TestDisjoint = Assert<Disjoint<never, "animal">>;

export type DisjointTriple<T, S, U> = Disjoint<T, S> extends true ? (Disjoint<T, U> extends true ? (Disjoint<S, U> extends true ? true : false) : false) : false;

type testDisjointTriple1 = Assert<DisjointTriple<"cat", "dog" | "animal", "bird">>;
type testDisjointTriple2 = Deny<DisjointTriple<"cat", "dog" | "animal", "cat" | "bird">>;
type testDisjointTriple3 = Assert<DisjointTriple<"cat", "dog" | "animal", number>>;
type testDisjointTriple4 = Deny<DisjointTriple<"cat", "dog" | "animal", string>>;
type testDisjointTriple5 = Assert<DisjointTriple<symbol, string, number>>;

// Note: If I need to test for mutual disjointness of more than 3 types I should make it take a tuple argument and use recursion. For now three is enough.

// Converts a Union to Tuple
export type UnionToTuple<T> = PickOne<T> extends infer U ? (Exclude<T, U> extends never ? [T] : [...UnionToTuple<Exclude<T, U>>, U]) : never;
// TODO: Add tests
