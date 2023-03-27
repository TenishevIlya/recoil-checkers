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
