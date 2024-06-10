import { Assert, Deny, Empty, SubtypeOf, TypeEq } from "./typeTesting";

type TupleLength = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export type Tuple<T, L extends TupleLength> = L extends 0
    ? [] | never[]
    : L extends 1
    ? [T]
    : L extends 2
    ? [T, T]
    : L extends 3
    ? [T, T, T]
    : L extends 4
    ? [T, T, T, T]
    : L extends 5
    ? [T, T, T, T, T]
    : L extends 6
    ? [T, T, T, T, T, T]
    : L extends 7
    ? [T, T, T, T, T, T, T]
    : L extends 8
    ? [T, T, T, T, T, T, T, T]
    : L extends 9
    ? [T, T, T, T, T, T, T, T, T]
    : L extends 10
    ? [T, T, T, T, T, T, T, T, T, T]
    : L extends 11
    ? [T, T, T, T, T, T, T, T, T, T, T]
    : L extends 12
    ? [T, T, T, T, T, T, T, T, T, T, T, T]
    : L extends 13
    ? [T, T, T, T, T, T, T, T, T, T, T, T, T]
    : L extends 14
    ? [T, T, T, T, T, T, T, T, T, T, T, T, T, T]
    : L extends 15
    ? [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]
    : never;

export type Tail<T extends any[]> = T extends [any, ...infer Rest] ? Rest : never;

export type Predecessor<L extends TupleLength> = Tail<Tuple<any, L>>["length"];

export type TupleUpTo<T, L extends TupleLength = 10> = L extends TupleLength ? Tuple<T, L> | TupleUpTo<T, Predecessor<L>> : never;

export type IsNonEmptyTuple<T extends unknown[]> = T extends [infer _, ...infer __] ? true : false;

// Technically the empty tuple is a subtype of never[] but not vice verse, but in terms of raw JS values they are always the same empty array. So I define never[] as a tuple and this includes the empty tuple [].
export type IsEmptyTuple<T extends unknown[]> = T extends never[] ? true : false;

export type IsTuple<T extends unknown[]> = IsNonEmptyTuple<T> extends true ? true : IsEmptyTuple<T> extends true ? true : false;

type TestIsTuple1 = Assert<IsTuple<never[]>>;
type TestIsTuple2 = Deny<IsTuple<string[]>>;
type TestIsTuple3 = Deny<IsTuple<any[]>>;
type TestIsTuple4 = Assert<IsTuple<[string, number]>>;
type TestIsTuple5 = Assert<IsTuple<[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]>>;

export type IntersectionOfTuple<T extends unknown[]> = T extends [infer U, ...infer Rest] ? (Rest extends never[] ? U : U & IntersectionOfTuple<Rest>) : never;
type TestIntersectionOfTuple1 = Empty<IntersectionOfTuple<[true, false, boolean]>>;
type TestIntersectionOfTuple2 = Deny<IntersectionOfTuple<[false, boolean, false]>>;
type TestIntersectionOfTuple3 = Assert<TypeEq<IntersectionOfTuple<[string, "cat" | "bird", "cat" | "dog"]>, "cat">>;
type TestIntersectionOfTuple4 = Assert<TypeEq<IntersectionOfTuple<[{}, { foo: number }, { foo: string }]>, { foo: never }>>;

export type UnionOfTuple<T extends any[]> = T extends [infer U, ...infer Rest] ? U | UnionOfTuple<Rest> : true;


// TODO: Move this to file
// This includes both never[] and empty tuple [] types but not [never]
// Note that an empty array is not an empty type since it has a value = [].
type IsEmptyArray<T> = [T] extends [[never]] ? false :  [T] extends [never[]]  ? true : false

type TestIsEmptyArray1 = Deny<IsEmptyArray<[never]>>
type TestIsEmptyArray2 = Deny<IsEmptyArray<[string]>>
type TestIsEmptyArray3 = Deny<IsEmptyArray<string[]>>
type TestIsEmptyArray4 = Assert<IsEmptyArray<[]>>
type TestIsEmptyArray5 = Assert<IsEmptyArray<never[]>>
type TestIsEmptyArray6 = Deny<IsEmptyArray<string>>