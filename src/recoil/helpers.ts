import type { GetRecoilValue } from "recoil";
import { INITIAL_POSITION } from "./constants";
import type {
  BaseTableElement,
  CellData,
  CellElement,
  CheckerElement,
} from "./types";
import { AllBrownCells, AllCheckers } from "./atoms";
import { getCrossCellKey } from "../components/Cell/BrownCell/helpers";

export const computeElementInitialData = (param: string): BaseTableElement => {
  const [rowIndex, columnIndex] = param.split("_").map(Number);
  const { xPos: initialXPos, yPos: initialYPos } = INITIAL_POSITION;

  return {
    cellData: {
      rowIndex,
      columnIndex,
    },
    position: {
      xPos: initialXPos + columnIndex * 100,
      yPos: initialYPos + rowIndex * 100,
    },
  };
};

export const canCheckerBeUsedForBeat = (
  activeChecker: CheckerElement,
  cellToCheck: CellElement,
  get: GetRecoilValue
): boolean => {
  const {
    cellData: {
      rowIndex: activeCheckerRowIndex,
      columnIndex: activeCheckerColumnIndex,
    },
  } = activeChecker;

  const {
    cellData: { rowIndex, columnIndex },
  } = cellToCheck;

  if (
    Math.abs(rowIndex - activeCheckerRowIndex) === 2 &&
    Math.abs(columnIndex - activeCheckerColumnIndex) === 2
  ) {
    const crossCellKey = getCrossCellKey({
      currCellData: cellToCheck.cellData,
      prevCellData: activeChecker.cellData,
    });

    const crossCell = get(AllBrownCells(crossCellKey));

    if (crossCell) {
      const { associatedCheckerKey } = crossCell;

      if (associatedCheckerKey) {
        const associatedChecker = get(AllCheckers(associatedCheckerKey));

        if (associatedChecker) {
          return associatedChecker.mode !== activeChecker.mode;
        }
      }
    }
  }

  return false;
};

export const isCellNeighbor = (
  cellData: CellData,
  checkerCellData: CellData
): boolean => {
  return (
    Math.abs(cellData.rowIndex - checkerCellData.rowIndex) === 1 &&
    Math.abs(cellData.columnIndex - checkerCellData.columnIndex) === 1
  );
};