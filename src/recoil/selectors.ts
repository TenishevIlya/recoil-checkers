import { selector, selectorFamily } from "recoil";
import { CheckerMode } from "../components/Checker/types";
import { ActiveChecker, ActiveCheckerBeatCells, AllBrownCells } from "./atoms";
import {
  canCheckerBeUsedForBeat,
  getPossibleCellsToBeat,
  isCellNeighbor,
} from "./helpers";

export const isAvailableToGoCellSelector = selectorFamily<boolean, string>({
  key: "IsAvailableToGoCellSelector",
  get:
    (cellKey: string) =>
    ({ get }) => {
      const cellsToBeat = get(ActiveCheckerBeatCells);

      if (cellsToBeat.length) {
        return cellsToBeat.includes(cellKey);
      }

      const activeChecker = get(ActiveChecker);
      const cellToCheck = get(AllBrownCells(cellKey));

      if (activeChecker && cellToCheck) {
        const { cellData: checkerCellData, mode } = activeChecker;
        const { cellData, associatedCheckerKey } = cellToCheck;

        const canBeUsedForBeat = canCheckerBeUsedForBeat(
          activeChecker,
          cellToCheck,
          get
        );

        if (canBeUsedForBeat) {
          return true;
        }

        if (associatedCheckerKey) {
          return false;
        }

        if (cellData.columnIndex === checkerCellData.columnIndex) return false;

        if (mode === CheckerMode.white) {
          return (
            cellData.rowIndex > checkerCellData.rowIndex &&
            isCellNeighbor(cellData, checkerCellData)
          );
        }
        if (mode === CheckerMode.black) {
          return (
            cellData.rowIndex < checkerCellData.rowIndex &&
            isCellNeighbor(cellData, checkerCellData)
          );
        }
      }

      return false;
    },
});

export const canContinueBeat = selector<boolean>({
  key: "CanContinueBeat",
  get: ({ get }) => {
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
  },
});
