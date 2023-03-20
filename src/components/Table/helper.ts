import { CellColors } from "../Cell/types";

export const cellColorDetector = (
  rowIndex: number,
  cellIndex: number
): CellColors => {
  if (rowIndex % 2 === 0) {
    return cellIndex % 2 ? CellColors.brown : CellColors.beige;
  }

  return cellIndex % 2 ? CellColors.beige : CellColors.brown;
};
