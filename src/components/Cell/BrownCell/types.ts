import type { CellData } from "../../../recoil/types";

export interface BrownCellI {
  containCheckerInitially: boolean;
  rowIndex: number;
  columnIndex: number;
}

export interface CellDimensions {
  width: number;
  height: number;
}

export type DefaultActionHookT<T> = (param: T) => void;

export interface PrevCurrCellsData {
  prevCellData: CellData;
  currCellData: CellData;
}
