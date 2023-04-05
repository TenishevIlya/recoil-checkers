import type { CellData } from "./recoil/types";

export const createElementKey = (
  rowIndex: number,
  columnIndex: number
): string => `${rowIndex}_${columnIndex}`;

export const createElementKeyFromObj = (keyObj: CellData): string => {
  const { rowIndex, columnIndex } = keyObj;

  return createElementKey(rowIndex, columnIndex);
};
