import { selector, selectorFamily } from "recoil";
import { CheckerMode } from "../components/Checker/types";
import {
  ActiveChecker,
  ActiveCheckerBeatCells,
  AllBrownCells,
  AllCheckers,
  AllCheckersKeys,
  CheckersAmountState,
} from "./atoms";
import { canCheckerBeUsedForBeat, isCellNeighbor } from "./helpers";
import { DIMENSIONS_AMOUNT } from "./constants";

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

        if (associatedCheckerKey) {
          return false;
        }

        if (canBeUsedForBeat) {
          return true;
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

export const getGameWinner = selector<CheckerMode | null>({
  key: "getGameWinnerSelector",
  get: ({ get }) => {
    const { black, white } = get(CheckersAmountState);
    const allCheckersKeys = get(AllCheckersKeys);

    if (white === 0) return CheckerMode.black;
    if (black === 0) return CheckerMode.white;

    let checkerAtOppositeSideMode;

    for (let index = 0; index < allCheckersKeys.length; index++) {
      const {
        mode,
        cellData: { rowIndex },
      } = get(AllCheckers(allCheckersKeys[index]));

      if (mode === CheckerMode.white && rowIndex === DIMENSIONS_AMOUNT - 1) {
        checkerAtOppositeSideMode = CheckerMode.white;
        break;
      }

      if (
        mode === CheckerMode.black &&
        rowIndex === DIMENSIONS_AMOUNT - DIMENSIONS_AMOUNT
      ) {
        checkerAtOppositeSideMode = CheckerMode.black;
        break;
      }
    }

    return checkerAtOppositeSideMode || null;
  },
});
