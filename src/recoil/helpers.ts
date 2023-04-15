import type { GetRecoilValue } from "recoil";
import { INITIAL_POSITION } from "./constants";
import type {
  BaseTableElement,
  CellData,
  CellElement,
  CheckerElement,
} from "./types";
import { AllBrownCells, AllCheckers, TableDimensions } from "./atoms";
import { getCrossCellKey } from "../components/Cell/BrownCell/helpers";
import { createElementKey } from "../helpers";

export const getRowColumnIndexesFromKey = (key: string) =>
  key.split("_").map(Number);

export const computeElementInitialData = (param: string): BaseTableElement => {
  const [rowIndex, columnIndex] = getRowColumnIndexesFromKey(param);
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
    associatedCheckerKey,
  } = cellToCheck;

  const { rows, columns } = get(TableDimensions);

  if (associatedCheckerKey) {
    return false;
  }

  const rowOutOfBounds = rowIndex > rows - 1 || rowIndex < 0;
  const columnOutOfBounds = columnIndex > columns - 1 || columnIndex < 0;

  if (rowOutOfBounds || columnOutOfBounds) {
    return false;
  }

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

export const getPossibleCellsToBeat = (
  activeChecker: CheckerElement,
  get: GetRecoilValue
): CellElement[] => {
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

  return possibleCellsToBeat;
};
