import { INITIAL_POSITION } from "./constants";
import type { BaseTableElement } from "./types";

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
