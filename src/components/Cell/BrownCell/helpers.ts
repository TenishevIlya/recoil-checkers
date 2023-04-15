import { GetRecoilValue } from "recoil";
import { createElementKey } from "../../../helpers";
import type { CellData } from "../../../recoil/types";
import type { PrevCurrCellsData } from "./types";
import {
  canCheckerBeUsedForBeat,
  getPossibleCellsToBeat,
} from "../../../recoil/helpers";
import { ActiveChecker } from "../../../recoil/atoms";

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

export const canContinueBeat = (get: GetRecoilValue): boolean => {
  const activeChecker = get(ActiveChecker);

  if (activeChecker) {
    const possibleCellsToBeat = getPossibleCellsToBeat(activeChecker, get);

    if (possibleCellsToBeat.length) {
      return possibleCellsToBeat.some(
        (cell) => cell && canCheckerBeUsedForBeat(activeChecker, cell, get)
      );
    }

    return false;
  }

  return false;
};
