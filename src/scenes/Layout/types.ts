import type { RecoilState } from "recoil";

export type AtomFamilyInstance<T> = (param: string) => RecoilState<T | null>;
