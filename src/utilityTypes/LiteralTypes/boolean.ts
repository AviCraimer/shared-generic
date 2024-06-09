import { IsTuple, TupleUpTo } from "../TupleUtils";
import { Assert, Deny, Empty, TypeEq } from "../typeTesting";

export type IsBooleanLiteral<T> = [true, false] extends [T, T] ? false : T extends Boolean ? true : false;
type TestBooleanLiteral1 = Assert<IsBooleanLiteral<false>>;
type TestBooleanLiteral2 = Assert<IsBooleanLiteral<true>>;
type TestBooleanLiteral3 = Deny<IsBooleanLiteral<boolean>>;
type TestBooleanLiteral4 = Deny<IsBooleanLiteral<string>>;

export type BooleanLiteral<T> = IsBooleanLiteral<T> extends true ? T : never;

export type BooleanTuple = TupleUpTo<boolean>;
export type AllTrueTuple = TupleUpTo<true>;
export type AllFalseTuple = TupleUpTo<false>;

export type BooleanLiteralTuple<T extends unknown[], Check extends unknown[] = []> = T extends BooleanTuple
    ? T extends [infer U, ...infer Rest]
        ? BooleanLiteral<U> extends never
            ? never
            : BooleanLiteralTuple<Rest, [...Check, U]>
        : Check
    : never;

export type RemoveBoolean<T> = T extends boolean ? never : T;
type TestRemoveBoolean1 = Assert<TypeEq<RemoveBoolean<true | string>, string>>;

type TestBooleanLiteralTuple1 = Empty<BooleanLiteralTuple<string[]>>;
type TestBooleanLiteralTuple2 = Empty<BooleanLiteralTuple<boolean[]>>;
type TestBooleanLiteralTuple3 = Empty<BooleanLiteralTuple<[string, true]>>;
type TestBooleanLiteralTuple4 = Empty<BooleanLiteralTuple<[true, boolean]>>;
type TestBooleanLiteralTuple5 = Empty<BooleanLiteralTuple<[boolean]>>;
type TestBooleanLiteralTuple6 = Assert<TypeEq<BooleanLiteralTuple<[]>, []>>;
type TestBooleanLiteralTuple7 = Assert<TypeEq<BooleanLiteralTuple<never[]>, []>>;
type TestBooleanLiteralTuple8 = Assert<TypeEq<BooleanLiteralTuple<[true, false]>, [true, false]>>;
type TestBooleanLiteralTuple9 = Assert<TypeEq<BooleanLiteralTuple<[false, false, true, false]>, [false, false, true, false]>>;

export type And<T extends BooleanTuple> = T extends AllTrueTuple ? true : false;
type TestAnd1 = Deny<And<[false, true, true]>>;
type TestAnd2 = Deny<And<[boolean, true]>>;
type TestAnd3 = Assert<And<[true, true, true]>>;

export type Or<T extends BooleanTuple> = BooleanLiteralTuple<T> extends never ? false : T extends AllFalseTuple ? false : true;
type TestOr1 = Assert<Or<[false, true, true]>>;
type TestOr2 = Assert<Or<[true, true, true]>>;
type TestOr3 = Deny<Or<[true, boolean]>>;
type TestOr4 = Deny<Or<[false, false, false]>>;

export type Not<T> = T extends true ? false : T extends false ? true : boolean;

export type NegateAll<T extends unknown[], Neg extends unknown[] = []> = [IsTuple<T>, IsTuple<Neg>] extends [true, true] ? (T extends [infer U, ...infer Rest] ? NegateAll<Rest, [...Neg, Not<U>]> : Neg) : never;

type TestNegateAll1 = Assert<TypeEq<NegateAll<[false, true, true]>, [true, false, false]>>;
type TestNegateAll2 = Assert<TypeEq<NegateAll<[false, false, true, false, boolean]>, [true, true, false, true, boolean]>>;
type TestNegateAll3 = Assert<TypeEq<NegateAll<[false, string]>, [true, boolean]>>;
type TestNegateAll4 = Empty<NegateAll<string[]>>;
