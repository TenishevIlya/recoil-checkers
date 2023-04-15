import { atom, atomFamily } from "recoil";
import type {
  BrownCellsForCheckersI,
  CellData,
  CellElement,
  CheckerElement,
  TableDimensionsI,
} from "./types";
import { CHECKERS_AMOUNT, DIMENSIONS_AMOUNT } from "./constants";
import {
  computeElementInitialData,
  getRowColumnIndexesFromKey,
} from "./helpers";
import { CheckerMode } from "../components/Checker/types";

export const BrownCellsForCheckers = atomFamily<BrownCellsForCheckersI, string>(
  {
    key: "BrownCellsForCheckers",
    default: (param: string) => {
      const [rows, columns] = getRowColumnIndexesFromKey(param);

      const cellsToRender: Array<CellData> = [];

      for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
          if (
            (rowIndex % 2 === 0 && columnIndex % 2 !== 0) ||
            (rowIndex % 2 !== 0 && columnIndex % 2 === 0)
          ) {
            cellsToRender.push({ rowIndex, columnIndex });
          }
        }
      }

      return {
        whiteCheckersCells: cellsToRender.slice(0, CHECKERS_AMOUNT),
        blackCheckersCells: cellsToRender.slice(
          cellsToRender.length - CHECKERS_AMOUNT,
          cellsToRender.length
        ),
      };
    },
  }
);

export const TableDimensions = atom<TableDimensionsI>({
  key: "TableDimensions",
  default: { rows: DIMENSIONS_AMOUNT, columns: DIMENSIONS_AMOUNT },
});

export const CurrentSideTurn = atom<CheckerMode>({
  key: "CurrentSideTurn",
  default: CheckerMode.white,
});

export const ActiveChecker = atom<CheckerElement | null>({
  key: "ActiveChecker",
  default: null,
});

export const ActiveCheckerBeatCells = atom<string[]>({
  key: "ActiveCheckerBeatCells",
  default: [],
});

export const AllCheckers = atomFamily<CheckerElement, string>({
  key: "AllCheckers",
  default: (param: string) => {
    const initialData = computeElementInitialData(param);

    return {
      ...initialData,
      isAlive: true,
      name: param,
    };
  },
});

export const AllBrownCells = atomFamily<CellElement, string>({
  key: "AllBrownCells",
  default: (param: string) => {
    const initialData = computeElementInitialData(param);

    return {
      ...initialData,
      associatedCheckerKey: null,
    };
  },
});

export const AllBrownCellsKeys = atom<string[]>({
  key: "AllBrownCellsKeys",
  default: [],
});

export const AllCheckersKeys = atom<string[]>({
  key: "AllCheckersKeys",
  default: [],
});

export const CheckersAmountState = atom<Record<CheckerMode, number>>({
  key: "CheckersAmountState",
  default: {
    black: CHECKERS_AMOUNT,
    white: CHECKERS_AMOUNT,
  },
});
