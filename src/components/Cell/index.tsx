import { ReactElement } from "react";
import { BeigeCell, BrownCell } from "./styles";
import { CellColors, CellI } from "./types";

export default function Cell({ cellColor }: CellI): ReactElement {
  return cellColor === CellColors.brown ? <BrownCell /> : <BeigeCell />;
}
