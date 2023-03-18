import tableStyles from "./Table.module.css";

export const cellStyleMatcher = (
  rowIndex: number,
  cellIndex: number
): string => {
  const { beigeCell, brownCell } = tableStyles;

  if (rowIndex % 2 === 0) {
    return cellIndex % 2 ? beigeCell : brownCell;
  }

  return cellIndex % 2 ? brownCell : beigeCell;
};
