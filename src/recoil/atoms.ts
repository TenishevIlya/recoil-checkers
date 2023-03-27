import { atom, atomFamily } from "recoil";
import type { BaseTableElement } from "./types";

export const ActiveChecker = atom<BaseTableElement | null>({
  key: "ActiveChecker",
  default: null,
});

export const AllCheckers = atomFamily<BaseTableElement | null, string>({
  key: "AllCheckers",
  default: null,
});

export const AllBrownCells = atomFamily<BaseTableElement | null, string>({
  key: "AllBrownCells",
  default: null,
});
