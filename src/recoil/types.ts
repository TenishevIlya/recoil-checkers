import type { CheckerMode } from "../components/Checker/types";

export interface BrownCellsForCheckersI {
  whiteCheckersCells: CellData[];
  blackCheckersCells: CellData[];
}

export interface BaseTableElement {
  position: Position;
  cellData: CellData;
}

export interface Position {
  xPos: number;
  yPos: number;
}

export interface CellData {
  rowIndex: number;
  columnIndex: number;
}

export interface CheckerElement extends BaseTableElement {
  isAlive: boolean;
  name: string;
  mode?: CheckerMode;
}

export interface CellElement extends BaseTableElement {
  associatedCheckerKey: string | null;
}
