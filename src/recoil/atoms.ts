import { atom, atomFamily, selectorFamily } from "recoil";
import type {
  BrownCellsForCheckersI,
  CellElement,
  CheckerElement,
} from "./types";
import { CHECKERS_AMOUNT, INITIAL_POSITION } from "./constants";

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

export const ActiveChecker = atom<CheckerElement | null>({
  key: "ActiveChecker",
  default: null,
});

export const AllCheckers = atomFamily<CheckerElement | null, string>({
  key: "AllCheckers",
  default: selectorFamily<CheckerElement | null, string>({
    key: "AllCheckers/CheckerInitializer",
    get:
      (param: string) =>
      ({ get }) => {
        const relatedCell = get(AllBrownCells(param));

        if (relatedCell) {
          return {
            ...relatedCell,
          };
        }

        return null;
      },
  }),
});

export const AllBrownCells = atomFamily<CellElement | null, string>({
  key: "AllBrownCells",
  default: (param: string) => {
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
      containChecker: false,
    };
  },
});
