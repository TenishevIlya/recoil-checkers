import { selector, selectorFamily } from "recoil";
import { CheckerMode } from "../components/Checker/types";
import {
  ActiveChecker,
  ActiveCheckerBeatCells,
  AllBrownCells,
  CheckersAmountState,
} from "./atoms";
import { canCheckerBeUsedForBeat, isCellNeighbor } from "./helpers";

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
  key: "EndOfGameRes",
  get: ({ get }) => {
    const { black, white } = get(CheckersAmountState);

    if (white === 0) return CheckerMode.black;
    if (black === 0) return CheckerMode.white;

    return null;
  },
});
