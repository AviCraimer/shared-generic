import { And } from "./boolean";
import { IsLiteral } from "./allLiterals";

export type IsNumber<T> = T extends number ? true : false;

export type IsNumberLiteral<T> = And<[IsLiteral<T>, IsNumber<T>]>;
