import { IsLiteral } from "./allLiterals";
import { And } from "./boolean";

export type IsSymbol<T> = T extends symbol ? true : false;

export type IsSymbolLiteral<T> = And<[IsLiteral<T>, IsSymbol<T>]>;
