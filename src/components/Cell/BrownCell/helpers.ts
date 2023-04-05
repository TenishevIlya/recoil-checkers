import { createElementKey } from "../../../helpers";
import type { CellData } from "../../../recoil/types";
import type { PrevCurrCellsData } from "./types";

export const getCrossCellKey = ({
  currCellData,
  prevCellData,
}: PrevCurrCellsData): string => {
  const { columnIndex: currColumnIndex, rowIndex: currRowIndex } = currCellData;
  const { columnIndex: prevColumnIndex, rowIndex: prevRowIndex } = prevCellData;

  return createElementKey(
    Math.max(currRowIndex, prevRowIndex) - 1,
    Math.max(currColumnIndex, prevColumnIndex) - 1
  );
};

export const isAbleToBeat = (prevPos: CellData, currPos: CellData): boolean => {
  const { rowIndex: rowIndexForAdd, columnIndex: columnIndexForAdd } = prevPos;
  const { rowIndex: rowIndexForRemove, columnIndex: columnIndexForRemove } =
    currPos;

  return (
    Math.abs(rowIndexForAdd - rowIndexForRemove) > 1 &&
    Math.abs(columnIndexForAdd - columnIndexForRemove) > 1
  );
};
