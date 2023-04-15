import type { CellData } from "../../../recoil/types";

export interface BrownCellI extends CellData {
  containCheckerInitially: boolean;
}

export type DefaultActionHookT<T> = (param: T) => void;

export interface PrevCurrCellsData {
  prevCellData: CellData;
  currCellData: CellData;
}
