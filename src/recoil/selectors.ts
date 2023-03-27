import { selectorFamily } from "recoil";
import { AllBrownCells } from "./atoms";
import { BaseTableElement } from "./types";

export const initialCheckerDataSelector = selectorFamily<
  BaseTableElement | null,
  string
>({
  key: "InitialCheckerDataSelector",
  get:
    (checkerKey: string) =>
    ({ get }) =>
      get(AllBrownCells(checkerKey)),
});
