import { ProperSubtypeOf } from "./typeTesting";

// *** Type Predicates ***

// Strict subtype checking, will not distribute across unions.
export type SubtypeOf<T, S> = [T] extends [S] ? true : false;

// If S or T are union types, this will distribute the subtype checking across the union members.
export type SubtypeDist<T, S> = T extends S ? true : false;

export type TypeEq<T, S> = [T, S] extends [S, T] ? true : false;

export type ProperSubtypeOf<T, S> = [SubtypeOf<T, S>, SubtypeOf<S, T>] extends [true, false] ? true : false;
// string is a proper subtype of the whole union number | string
type TestProperSubtypeOf1 = Assert<ProperSubtypeOf<string, number | string>>;
type TestProperSubtypeOf2 = Assert<ProperSubtypeOf<boolean, boolean | object>>;
type TestProperSubtypeOf3 = Deny<ProperSubtypeOf<boolean, true | false>>;

// Distribute proper subtype checking across union components. This is useful for detecting literals.
export type ProperSubtypeDist<T, S> = [SubtypeDist<T, S>, SubtypeDist<S, T>] extends [true, false] ? true : false;

type TestProperSubtypeDist1 = Assert<ProperSubtypeDist<"cat" | "dog", string>>;
type TestProperSubtypeDist3 = Assert<ProperSubtypeDist<"cat" | 1, number | string>>;
type TestProperSubtypeDist2 = Deny<ProperSubtypeDist<"cat" | string, string>>;
type TestProperSubtypeDist4 = Deny<ProperSubtypeDist<string | number, number | string>>;
// string is not a proper subtype of any union component of S.
type TestProperSubtypeDist5 = Deny<ProperSubtypeDist<string, number | string>>;
type TestProperSubtypeDist6 = Deny<ProperSubtypeDist<boolean, true | false>>;
// Since boolean is defined as a finite union true|false the distribution does not have any proper subtypes.
type TestProperSubtypeDist7 = Deny<ProperSubtypeDist<true, boolean>>;

export type Inhabited<T> = T extends never ? false : true;

// *** Trigger Type Errors for Tests ***
export type Assert<T extends true> = never;

export type Deny<T extends false> = never;

export type Empty<T extends never> = never;
