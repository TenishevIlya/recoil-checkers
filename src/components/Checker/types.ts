import type { CellData } from "../../recoil/types";

export interface CheckerI extends CellData {
  mode: CheckerMode;
}

export enum CheckerMode {
  white = "white",
  black = "black",
}
