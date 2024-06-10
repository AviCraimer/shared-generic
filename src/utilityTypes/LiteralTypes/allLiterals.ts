import { NonNever } from "../never";
import { ProperSubtypeDist, Deny, Assert } from "../typeTesting";
import { And, RemoveBoolean } from "./boolean";

// Boolean literal sets are different since boolean itself is a finite set.
type IsFiniteLiteralOrNever<T> = RemoveBoolean<T> extends never ? (T extends boolean ? true : false) : ProperSubtypeDist<RemoveBoolean<T>, string | number | symbol>;

type IsFiniteLiteral<T> = And<[NonNever<T>, IsFiniteLiteralOrNever<T>]>;

const testSymbol = Symbol("cat");
type TestSymbol = typeof testSymbol;
type TestIsFiniteLiteral1 = Assert<IsFiniteLiteral<"cat">>;
type TestIsFiniteLiteral15 = Deny<IsFiniteLiteral<never>>;
type TestIsFiniteLiteral2 = Assert<IsFiniteLiteral<"cat" | "dog" | false>>;
type TestIsFiniteLiteral25 = Deny<IsFiniteLiteral<boolean | string>>;
type TestIsFiniteLiteral3 = Assert<IsFiniteLiteral<TestSymbol | 1 | "cat">>;
type TestIsFiniteLiteral4 = Deny<IsFiniteLiteral<TestSymbol | number>>;
type TestIsFiniteLiteral5 = Deny<IsFiniteLiteral<"dog" | symbol>>;
type TestIsFiniteLiteral6 = Deny<IsFiniteLiteral<never>>;

export type IsLiteral<T> = IsFiniteLiteral<T> extends false ? false : UnionToTuple<T>["length"] extends 1 ? true : false;

type TestIsSingletonLiteral1 = Deny<IsLiteral<never>>;
type TestIsSingletonLiteral15 = Deny<IsLiteral<boolean>>;
type TestIsSingletonLiteral2 = Assert<IsLiteral<true>>;
type TestIsSingletonLiteral3 = Assert<IsLiteral<"cat" | "cat">>;
type TestIsSingletonLiteral4 = Assert<IsLiteral<`${"cat"}`>>;
type TestIsSingletonLiteral5 = Deny<IsLiteral<`${"cat" | "dog"}`>>;
type TestIsSingletonLiteral6 = Deny<IsLiteral<TestSymbol | 3>>;
type TestIsSingletonLiteral7 = Deny<IsLiteral<string>>;
type TestIsSingletonLiteral8 = Deny<IsLiteral<3 | 5 | 2>>;
type TestIsSingletonLiteral9 = Assert<IsLiteral<TestSymbol>>;
type TestIsSingletonLiteral10 = Assert<IsLiteral<0>>;
