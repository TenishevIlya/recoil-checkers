import { atom, atomFamily } from "recoil";
import type {
  BrownCellsForCheckersI,
  CellElement,
  CheckerElement,
  TableDimensionsI,
} from "./types";
import { CHECKERS_AMOUNT } from "./constants";
import { computeElementInitialData } from "./helpers";
import { CheckerMode } from "../components/Checker/types";

export const BrownCellsForCheckers = atomFamily<BrownCellsForCheckersI, string>(
  {
    key: "BrownCellsForCheckers",
    default: (param: string) => {
      const [rows, columns] = param.split("_").map(Number);

      const cellsToRender: Array<{ rowIndex: number; columnIndex: number }> =
        [];

      for (let index = 0; index < rows; index++) {
        for (let innerIndex = 0; innerIndex < columns; innerIndex++) {
          if (
            (index % 2 === 0 && innerIndex % 2 !== 0) ||
            (index % 2 !== 0 && innerIndex % 2 === 0)
          ) {
            cellsToRender.push({ rowIndex: index, columnIndex: innerIndex });
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
  default: { rows: 4, columns: 4 },
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

export const AllCheckers = atomFamily<CheckerElement | null, string>({
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

export const AllBrownCells = atomFamily<CellElement | null, string>({
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
  key: "Checkers",
  default: {
    black: CHECKERS_AMOUNT,
    white: CHECKERS_AMOUNT,
  },
});
