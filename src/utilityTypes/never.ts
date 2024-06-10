
import { Deny, Assert } from "./typeTesting";



export type IsNever<T> = [T] extends [never] ? true : false;

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

// This recursively tests for non-insatiability and distributes across unions (with the exception of never itself).
type IsEmptyDistributed<T> =
[T] extends [never] ?
    true :
T extends [never] ?
    true:
    T extends never[] ? false :
    T extends object ?
        true extends {[K in keyof T]: IsEmptyDistributed<T[K]> }[keyof T] ? true : false :
        false

// If any union members are not empty, then the whole union is not empty, so we check for false in the union returned from the distributed type.
// By wrapping the check in a tuple type we prevent distribution over possible multiple boolean values.
// e.g., IsEmptyDistributed<[number, never] | [string]> returns boolean, while IsEmptyType<[number, never] | [string]> returns false.
export type IsEmptyType<T> = [false] extends [IsEmptyDistributed<T>] ? false : true


// Basic
type TestIsEmptyType0 = Assert<IsEmptyType<never>>
type TestIsEmptyType05 = Deny<IsEmptyType<string>>

// Tuples
type TestIsEmptyType1 = Deny<IsEmptyType<[]>>
type TestIsEmptyType2 = Assert<IsEmptyType<[never]>>
type TestIsEmptyType3 = Assert<IsEmptyType<[string, never]>>
type TestIsEmptyType4 = Assert<IsEmptyType<[string, never, number]>>
type TestIsEmptyType5 = Deny<IsEmptyType<[string, number]>>
type TestIsEmptyType55 = Assert<IsEmptyType<[string, { foo: { bar: { baz: never }}, bar: string}, 6 ]>>
type TestIsEmptyType6 = Deny<IsEmptyType<string[]>>

// Arrays
type TestIsEmptyType7 = Deny<IsEmptyType<never[]>> // Despite the presence of never here, it is not empty since it has the value []
type TestIsEmptyType75 = Deny<IsEmptyType<[]>>
type TestIsEmptyType8 = Assert<IsEmptyType<[never][]>>
type TestIsEmptyType9 = Assert<IsEmptyType<{foo: never}[]>>
type TestIsEmptyType10 = Assert<IsEmptyType<{foo: {bar: never}}[]>>

// Objects
type TestIsEmptyType11 = Deny<IsEmptyType<{ foo: string }>>;
type TestIsEmptyType12 = Assert<IsEmptyType<{ foo: never }>>;
type TestIsEmptyType13 = Deny<IsEmptyType<{ foo: string; bar: number }>>;
type TestIsEmptyType14 = Assert<IsEmptyType<{ foo: { bar: { baz: never }}, bar: string  }>>
type TestIsEmptyType15 = Deny<IsEmptyType<{ foo: { bar: { baz: string } } }>>
type TestIsEmptyType16 = Assert<IsEmptyType<{ foo: string; bar: never }>>;

// Unions involving simple types
type TestIsEmptyTypeUnion1 = Deny<IsEmptyType<never | string>>;
type TestIsEmptyTypeUnion2 = Deny<IsEmptyType<never | never[]>>;
type TestIsEmptyTypeUnion3 = Deny<IsEmptyType<string | number>>;

// Unions involving tuples and objects
type TestIsEmptyTypeUnion4 = Deny<IsEmptyType<[never] | [string]>>;
type TestIsEmptyTypeUnion5 = Deny<IsEmptyType<{ foo: never } | { foo: string }>>;
type TestIsEmptyTypeUnion6 = Assert<IsEmptyType<[never] | { foo: never }>>;
type TestIsEmptyTypeUnion7 = Assert<IsEmptyType<[string, never] | { foo: never }>>;

// Unions where both types are empty
type TestIsEmptyTypeUnion8 = Assert<IsEmptyType<{ foo: never } | { bar: never }>>;
type TestIsEmptyTypeUnion9 = Assert<IsEmptyType<[never] | { foo: never }>>;
type TestIsEmptyTypeUnion10 = Assert<IsEmptyType<{ foo: never } | { foo: string, bar: never }>>;

// Nested and complex unions
type TestIsEmptyTypeUnion11 = Assert<IsEmptyType<{ foo: never } | [string, { bar: never }]>>;
type TestIsEmptyTypeUnion12 = Assert<IsEmptyType<{ foo: never } | [never, { bar: never }]>>;
type TestIsEmptyTypeUnion13 = Assert<IsEmptyType<{ foo: string; bar: never } | [string, never]>>;
type TestIsEmptyTypeUnion14 = Deny<IsEmptyType<{ foo: { bar: { baz: never | {foo: never, bar: string} } }, bar: string } | never[]>>;



export type Inhabited<T> =  [IsEmptyType<T>] extends [true]  ? false : true;

type TestInhabited1  = Assert<Inhabited<{ foo: string; bar: "Cat"}>>;

