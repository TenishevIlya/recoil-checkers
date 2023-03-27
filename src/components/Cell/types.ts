import type { CellData } from "../../recoil/types";

export interface CellI extends CellData {
  cellColor: CellColors;
}

export enum CellColors {
  brown = "brown",
  beige = "beige",
}
