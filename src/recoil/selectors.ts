import { selectorFamily } from "recoil";
import { CheckerMode } from "../components/Checker/types";
import { ActiveChecker, AllBrownCells } from "./atoms";
import { canCheckerBeUsedForBeat, isCellNeighbor } from "./helpers";

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
