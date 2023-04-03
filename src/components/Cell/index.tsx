import { ReactElement } from "react";
import BrownCell from "./BrownCell";
import { BeigeCell } from "./styles";
import { CellColors, CellI } from "./types";

export default function Cell({
  cellColor,
  columnIndex,
  rowIndex,
  containCheckerInitially,
}: CellI): ReactElement {
  return cellColor === CellColors.brown ? (
    <BrownCell {...{ columnIndex, rowIndex, containCheckerInitially }} />
  ) : (
    <BeigeCell />
  );
}
