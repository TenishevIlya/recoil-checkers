import { selector, selectorFamily } from "recoil";
import { CheckerMode } from "../components/Checker/types";
import { ActiveChecker, AllBrownCells } from "./atoms";
import { canCheckerBeUsedForBeat, isCellNeighbor } from "./helpers";
import { createElementKey } from "../helpers";

export const isAvailableToGoCellSelector = selectorFamily<boolean, string>({
  key: "IsAvailableToGoCellSelector",
  get:
    (cellKey: string) =>
    ({ get }) => {
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
      const { rowIndex, columnIndex } = activeChecker.cellData;

      const topLeftCell = get(
        AllBrownCells(createElementKey(rowIndex - 2, columnIndex - 2))
      );
      const topRightCell = get(
        AllBrownCells(createElementKey(rowIndex - 2, columnIndex + 2))
      );
      const bottomRightCell = get(
        AllBrownCells(createElementKey(rowIndex + 2, columnIndex + 2))
      );
      const bottomLeftCell = get(
        AllBrownCells(createElementKey(rowIndex + 2, columnIndex - 2))
      );

      const possibleCellsToBeat = [
        bottomLeftCell,
        bottomRightCell,
        topLeftCell,
        topRightCell,
      ];

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
