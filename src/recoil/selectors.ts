import { selectorFamily } from "recoil";
import { CheckerMode } from "../components/Checker/types";
import { ActiveChecker, AllBrownCells } from "./atoms";

export const isAvailableToGoCellSelector = selectorFamily<boolean, string>({
  key: "IsAvailableToGoCellSelector",
  get:
    (cellKey: string) =>
    ({ get }) => {
      const activeChecker = get(ActiveChecker);
      const cellToCheck = get(AllBrownCells(cellKey));

      if (activeChecker && cellToCheck) {
        const { cellData: checkerCellData, mode } = activeChecker;
        const { cellData, associatedCellKey } = cellToCheck;

        if (associatedCellKey) {
          return false;
        }

        if (cellData.columnIndex === checkerCellData.columnIndex) return false;

        if (mode === CheckerMode.white) {
          return cellData.rowIndex > checkerCellData.rowIndex;
        }
        if (mode === CheckerMode.black) {
          return cellData.rowIndex < checkerCellData.rowIndex;
        }
      }

      return false;
    },
});
