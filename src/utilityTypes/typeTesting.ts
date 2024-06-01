export type TypeEq<T, S> = [T, S] extends [S, T] ? true : false;

export type Assert<T extends true> = true;
