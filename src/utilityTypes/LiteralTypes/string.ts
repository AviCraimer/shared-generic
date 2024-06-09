import { And } from "./boolean";
import { IsLiteral } from "./allLiterals";

export type IsString<T> = T extends string ? true : false;

// Returns type if it is a finite union strings.
export type FiniteStringUnion<T> = T extends `${infer Literal}` ? T : never;
// TODO: Add tests

// Gets the size of a string union type
export type StringUnionSize<T> = FiniteStringUnion<T> extends never ? "Infinity" : UnionToTuple<T>["length"];

type test12 = Assert<StringUnionSize<"cat" | "dog" | string> extends "Infinity" ? true : false>;
type test23 = Assert<StringUnionSize<"cat" | "dog" | "dog"> extends 2 ? true : false>;
type test43 = Assert<StringUnionSize<"cat"> extends 1 ? true : false>;

// Keeps type only if it is a string literal
export type LiteralString<T> = StringUnionSize<T> extends 1 ? T : never;

type TestLiteral1 = Assert<LiteralString<"cat"> extends "cat" ? true : false>;
type TestLiteral2 = Assert<LiteralString<"cat" | "dog"> extends never ? true : false>;
type TestLiteral3 = Assert<LiteralString<"cat" | "dog" | string> extends never ? true : false>;

// Demo purposes, may be useful at some point.
// Uses variadic argument to get around the circular constraint error
// Not sure if it is worth it.
export const literalString = <const T extends [T[0] & LiteralString<T[0]>]>(...literalString: T) => literalString[0];

const myLiteral = literalString("cat");

export type NonEmptyString<T> = T extends "" ? never : T;

export type IsStringLiteral<T> = And<[IsLiteral<T>, IsString<T>]>;
