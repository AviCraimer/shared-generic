import { ProperSubtypeDist, Deny, Assert } from "../typeTesting";
import { RemoveBoolean } from "./boolean";

// Boolean literal sets are different since boolean itself is a finite set.
export type IsFiniteLiteral<T> = RemoveBoolean<T> extends never ? (T extends boolean ? true : false) : ProperSubtypeDist<RemoveBoolean<T>, string | number | symbol>;

const testSymbol = Symbol("cat");
type TestSymbol = typeof testSymbol;
type TestFiniteLiterals1 = Assert<IsFiniteLiteral<"cat">>;
type TestFiniteLiterals2 = Assert<IsFiniteLiteral<"cat" | "dog" | false>>;

// TODO: This is an issue.
type TestFiniteLiterals25 = Deny<IsFiniteLiteral<boolean | string>>;
type TestFiniteLiterals3 = Assert<IsFiniteLiteral<TestSymbol | 1 | "cat">>;
type TestFiniteLiterals4 = Deny<IsFiniteLiteral<TestSymbol | number>>;
type TestFiniteLiterals5 = Deny<IsFiniteLiteral<"dog" | symbol>>;

export type IsLiteral<T> = IsFiniteLiteral<T> extends false ? false : UnionToTuple<T>["length"] extends 1 ? true : false;

type TestIsSingletonLiteral1 = Deny<IsLiteral<boolean>>;
type TestIsSingletonLiteral2 = Assert<IsLiteral<true>>;
type TestIsSingletonLiteral3 = Assert<IsLiteral<"cat" | "cat">>;
type TestIsSingletonLiteral4 = Assert<IsLiteral<`${"cat"}`>>;
type TestIsSingletonLiteral5 = Deny<IsLiteral<`${"cat" | "dog"}`>>;
type TestIsSingletonLiteral6 = Deny<IsLiteral<TestSymbol | 3>>;
type TestIsSingletonLiteral7 = Deny<IsLiteral<string>>;
type TestIsSingletonLiteral8 = Deny<IsLiteral<3 | 5 | 2>>;
type TestIsSingletonLiteral9 = Assert<IsLiteral<TestSymbol>>;
type TestIsSingletonLiteral10 = Assert<IsLiteral<0>>;
